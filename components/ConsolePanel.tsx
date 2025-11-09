
import React, { useRef, useEffect } from 'react';
import { ConsoleOutput } from '../types';

interface ConsolePanelProps {
    output: ConsoleOutput[];
}

const ConsolePanel: React.FC<ConsolePanelProps> = ({ output }) => {
    const endOfMessagesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [output]);

    const getIconAndColor = (type: ConsoleOutput['type']) => {
        switch (type) {
            case 'error':
                return { icon: 'fa-times-circle', color: 'text-red-400' };
            case 'warn':
                return { icon: 'fa-exclamation-triangle', color: 'text-yellow-400' };
            case 'info':
                return { icon: 'fa-info-circle', color: 'text-blue-400' };
            default:
                return { icon: 'fa-chevron-right', color: 'text-gray-500' };
        }
    };

    return (
        <div className="bg-[#181818] rounded-lg flex flex-col h-full border border-[#262626]">
            {/* Header removed as it's now redundant with tabs */}
            <div className="flex-grow p-4 overflow-y-auto font-mono text-sm custom-scrollbar">
                {output.length === 0 && (
                    <div className="text-gray-600 italic">Console output will appear here...</div>
                )}
                {output.map((line, index) => {
                    const { icon, color } = getIconAndColor(line.type);
                    return (
                        <div key={index} className={`flex items-start gap-2 mb-1 ${color}`}>
                            <i className={`fas ${icon} mt-1 opacity-70`}></i>
                            <span className="flex-1 whitespace-pre-wrap break-all">{line.message}</span>
                        </div>
                    );
                })}
                <div ref={endOfMessagesRef} />
            </div>
        </div>
    );
};

export default ConsolePanel;
