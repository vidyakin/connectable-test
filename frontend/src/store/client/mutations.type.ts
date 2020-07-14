// добавление данных по новому клиенту в их список
export const ADD_CLIENT = 'ADD_CLIENT'

// заполнение общего массива клиентов стейта
export const SET_CLIENTS = 'SET_CLIENTS'

// заполнение данных клиента для редактирования и просмотра
export const SET_CURRENT_CLIENT = 'SET_CURRENT_CLIENT'

// обновление данных существующего клиента
export const UPDATE_CLIENT = 'UPDATE_CLIENT'

// установка кода клиента, пользователь которого вошел в систему
//  - надо переделать, слить с процедурой логина всех типов
export const SET_LOGGED_CLIENT = 'SET_LOGGED_CLIENT'

// смена клиента для суперадмина
export const CHANGE_WORKSPACE = 'CHANGE_WORKSPACE'

// статистика по данным в БД
export const SET_STATISTIC = 'SET_STATISTIC'
export const UPDATE_STATISTIC = 'UPDATE_STATISTIC'