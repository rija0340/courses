import { useCallback, useEffect, useState } from 'react';
import courseStorage from '../services/courseStorage';
import { findLessonInPack, flattenLessons } from '../data/coursePackSchema';

/**
 * Load a course pack (Supabase / local / seed). Falls back to null if none.
 */
export default function useCoursePack(courseId) {
  const [pack, setPack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!courseId) {
      setPack(null);
      setLoading(false);
      return null;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await courseStorage.getPack(courseId);
      setPack(data);
      return data;
    } catch (err) {
      console.error(err);
      setError(err.message || 'Erreur chargement cours');
      setPack(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    pack,
    loading,
    error,
    refresh,
    findLesson: (lessonId) => findLessonInPack(pack, lessonId),
    flatLessons: pack ? flattenLessons(pack) : [],
  };
}
