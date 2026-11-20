import type { PageServerLoad } from './$types';
import { calendarImage } from '$lib/server/uploads';

export const load: PageServerLoad = () => ({ calendar: calendarImage() });
