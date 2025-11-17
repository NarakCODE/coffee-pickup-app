import { Router } from 'express';
import {
  search,
  getSuggestions,
  getRecentSearches,
  deleteAllSearches,
  deleteSearch,
} from '../controllers/searchController.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

/**
 * Public search endpoint
 * GET /search?query=coffee&type=all
 */
router.get('/', search);

/**
 * Get autocomplete suggestions
 * GET /search/suggestions?query=cof
 */
router.get('/suggestions', getSuggestions);

/**
 * Get user's recent searches (authenticated)
 * GET /search/recent
 */
router.get('/recent', authenticate, getRecentSearches);

/**
 * Delete all recent searches (authenticated)
 * DELETE /search/recent
 */
router.delete('/recent', authenticate, deleteAllSearches);

/**
 * Delete a specific search from history (authenticated)
 * DELETE /search/recent/:searchId
 */
router.delete('/recent/:searchId', authenticate, deleteSearch);

export default router;
