
import { Course, RawCurriculumDatabase } from './types';
import { rawCurriculumData } from './javascriptCurriculum';

// Cast and map the raw JSON to our internal Course interface if necessary
const rawDb = rawCurriculumData as RawCurriculumDatabase;

export const JAVASCRIPT_COURSE: Course = {
    id: rawDb.course.id,
    title: rawDb.course.name, // Mapping 'name' from JSON to 'title' for UI consistency
    description: rawDb.course.description,
    modules: rawDb.course.modules
};

export const INITIAL_PROGRESS = {
  completedLessons: [],
  // Default to the first lesson of the first module
  currentLessonId: JAVASCRIPT_COURSE.modules[0]?.lessons[0]?.id || 'js-vars-101',
  aiMemory: ['User is a complete beginner.'],
};
