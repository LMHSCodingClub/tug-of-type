import { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server'
import { decrementTimer } from '../lib/helpers';

export default mutation(({ db }, { id }) => decrementTimer(db, { id, tableName: 'races' }))