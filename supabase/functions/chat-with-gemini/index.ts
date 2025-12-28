import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // 1. Verify Authentication
        const authHeader = req.headers.get('Authorization')!
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: authHeader } } }
        )

        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // 2. Handle Key Retrieval Request OR Chat Request
        const body = await req.json().catch(() => ({}))

        if (body.action === 'get_key') {
            const apiKey = Deno.env.get('GEMINI_API_KEY')
            if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

            return new Response(JSON.stringify({ apiKey }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        const { prompt, history, modelName } = body
        const apiKey = Deno.env.get('GEMINI_API_KEY')

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY is not set')
        }

        // 3. Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: modelName || 'gemini-pro' })

        // 4. Generate Content
        // If history is provided, use chat mode
        if (history && Array.isArray(history)) {
            const chat = model.startChat({
                history: history.map(msg => ({
                    role: msg.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: msg.parts ? msg.parts[0].text : msg.text }] // Adapt based on your exact history format
                }))
            })
            const result = await chat.sendMessage(prompt)
            const response = result.response
            const text = response.text()

            return new Response(JSON.stringify({ text }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
        }

        // Default to generateContent
        const result = await model.generateContent(prompt)
        const response = result.response
        const text = response.text()

        return new Response(JSON.stringify({ text }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }
})
