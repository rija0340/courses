import { supabase } from '../supabaseClient';
import { getCoursePackSeed } from '../../data/courseSeeds';
import { normalizePack } from '../../data/coursePackSchema';
import { requireAuthSession } from '../supabaseHealth';

const supabaseCourseProvider = {
  async getPack(courseId) {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('course_packs')
      .select('course_id, payload, updated_at')
      .eq('course_id', courseId)
      .maybeSingle();

    if (error) {
      // Table missing or network — fall back to seed instead of hard-failing learner UI
      console.warn('Error fetching course pack:', error.message);
      return null;
    }
    if (!data?.payload) return null;
    return normalizePack({ ...data.payload, courseId: data.course_id });
  },

  async savePack(courseId, pack) {
    if (!supabase) throw new Error('Supabase non configuré');
    await requireAuthSession();

    const normalized = normalizePack({ ...pack, courseId });
    const { data, error } = await supabase
      .from('course_packs')
      .upsert(
        {
          course_id: courseId,
          payload: normalized,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'course_id' }
      )
      .select('course_id, payload')
      .single();

    if (error) {
      console.error('Error saving course pack:', error);
      throw new Error(error.message);
    }
    return normalizePack({ ...data.payload, courseId: data.course_id });
  },

  async ensureSeeded(courseId) {
    const existing = await this.getPack(courseId);
    if (existing) return existing;

    const seed = getCoursePackSeed(courseId);
    if (!seed) return null;

    // Public read is allowed; seed write needs auth. If not logged in, return seed in-memory only.
    if (!supabase) return normalizePack(seed);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData?.session) {
        return this.savePack(courseId, seed);
      }
    } catch (err) {
      console.warn('Could not seed course pack to Supabase:', err.message);
    }
    return normalizePack(seed);
  },

  async listPacks() {
    if (!supabase) return [];
    const { data, error } = await supabase.from('course_packs').select('course_id');
    if (error) {
      console.error('Error listing course packs:', error);
      throw new Error(error.message);
    }
    return (data || []).map((row) => row.course_id);
  },

  async deletePack(courseId) {
    if (!supabase) throw new Error('Supabase non configuré');
    await requireAuthSession();
    const { error } = await supabase.from('course_packs').delete().eq('course_id', courseId);
    if (error) throw new Error(error.message);
  },
};

export default supabaseCourseProvider;
