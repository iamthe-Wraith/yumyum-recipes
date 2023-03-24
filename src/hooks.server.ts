import { sequence } from '@sveltejs/kit/hooks';
import { authenticate } from './hooks/authenticate';
 
export const handle = sequence(authenticate);