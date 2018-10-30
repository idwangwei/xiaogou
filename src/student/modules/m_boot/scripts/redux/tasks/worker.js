/**
 * Created by 彭建伦 on 2016/5/31.
 */
import  {createWorker} from 'worker-runner/workerRunner';
import * as tasks from './tasks';

createWorker(tasks);

