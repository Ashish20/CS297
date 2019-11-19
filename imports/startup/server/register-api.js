/**
 * Register each api
 * import private server methods and server publications
 */

// users api
import '../../api/users/publications.js';
import '../../api/users/hooks.js';

// counters api (example)
import '../../api/counters/methods.js';
import '../../api/counters/publications.js';

// import another api
import '../../api/issues/methods.js';
import '../../api/issues/publications.js';


// import another api
import '../../api/UserFiles/publications.js';
