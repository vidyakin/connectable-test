// операции с отделами
export const ADD_NEW_DEP = 'ADD_NEW_DEP';
export const GET_DEP = 'GET_DEP';
export const DELETE_DEP = 'DELETE_DEP';
export const UPDATE_DEP = 'UPDATE_DEP';
// операции со структурой
export const GET_STRUCTURE = 'GET_STRUCTURE';
export const SAVE_STRUCTURE = 'SAVE_STRUCTURE';
export const EDIT_STRUCTURE = 'EDIT_STRUCTURE';
// операции с сотрудниками отделов
export const GET_DEPT_USERS = 'GET_DEPT_USERS';  // получить всех сотрудников всех отделов по клиенту
export const CREATE_DEPT_USER = 'CREATE_DEPT_USER'; // добавить одного сотрудника в отдел
export const SAVE_DEPT_USERS = 'SAVE_DEPT_USERS';  // сохранение всех сотрудников отдела разом
export const DELETE_DEPT_USER = 'DELETE_DEPT_USER'; // удалить одного сотрудника из отдела
export const EDIT_DEPT_USER = 'EDIT_DEPT_USER'; // изменить сотрудника в отделе (например сделать главным)
