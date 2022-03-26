/*
redux最核心的管理对象store
 */
import { createStore, applyMiddleware } from 'redux'

import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'

import reducer from './reducer'
// 中间件
const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store