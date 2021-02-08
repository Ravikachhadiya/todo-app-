import * as actionTypes from '../actions';

const initialState = {
    toDoDetails: [],
    todoLists: [],
    tasksList: []
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.GET_TODO_LIST:
            let email = localStorage.getItem('currentUser');
            let todoListData = JSON.parse(localStorage.getItem('todoListData'))
                ?.filter((data) => data.email === email)[0];

            if (todoListData === undefined) {
                return {
                    ...state,
                    todoLists: [],
                }
            }

            console.log(todoListData);
            let todoListArray = todoListData.todoData.map((data) => {
                return {
                    title: data.title,
                    id: data.id
                };
            });

            return {
                ...state,
                todoLists: todoListArray,
            }
        case actionTypes.RESET_TODO:
            return {
                ...state,
                toDoDetails: [],
                tasksList: []
            }
        case actionTypes.GET_TODO_DETAILS:
            let eml = localStorage.getItem('currentUser');
            let todoListData1 = JSON.parse(localStorage.getItem('todoListData'))
                .filter((data) => data.email === eml)[0];
            let todoDetailsArray = todoListData1.todoData.filter((data) => {
                console.log("data : ");
                console.log(data);
                console.log(action.id);
                if (data.id === action.id) {
                    return true;
                }
                return false;
            })[0];
            // console.log(todoDetailsArray);
            // console.log(todoDetailsArray.todoList);

            return {
                ...state,
                toDoDetails: todoDetailsArray !== undefined ? todoDetailsArray : [],
                tasksList: todoDetailsArray !== undefined ? todoDetailsArray.todoList : []
            }
        case actionTypes.CREATE_TODO:
            let usersToDoList = JSON.parse(localStorage.getItem('todoListData'));

            let emailUsr = localStorage.getItem('currentUser');
            let dataIndex = 0;
            let isDataExist = usersToDoList?.filter((data, index) => {
                if (data.email === emailUsr) {
                    dataIndex = index;
                    return true;
                }
                else {
                    return false;
                }
            });

            // console.log(isDataExist);
            // only first time when totally empty todo
            if (usersToDoList === null) {
                let todoDataTemp = [
                    {
                        email: emailUsr,
                        todoData: [
                            {
                                id: new Date(),
                                title: action.title,
                                category: action.category,
                                image: action.image,
                                todoList: []
                            }
                        ]

                    }
                ];
                localStorage.setItem('todoListData', JSON.stringify(todoDataTemp));

                todoDataTemp[0].todoData[0].id = JSON.parse(JSON.stringify(todoDataTemp[0].todoData[0].id));

                return {
                    ...state,
                    toDoDetails: todoDataTemp[0].todoData[0]
                }
            }

            // when user has no todo data
            else if (isDataExist.length === 0) {
                let todoDataTemp = [
                    {
                        email: emailUsr,
                        todoData: [
                            {
                                id: new Date(),
                                title: action.title,
                                category: action.category,
                                image: action.image,
                                todoList: []
                            }
                        ]
                    }
                ];

                console.log(todoDataTemp);

                usersToDoList.push(todoDataTemp[0]);

                console.log(usersToDoList);

                localStorage.setItem('todoListData', JSON.stringify(usersToDoList));

                todoDataTemp[0].todoData[0].id = JSON.parse(JSON.stringify(todoDataTemp[0].todoData[0].id));

                return {
                    ...state,
                    toDoDetails: todoDataTemp[0].todoData[0]
                }

            }
            else {
                console.log("lets do");
                let todoDetailsTemp = {
                    id: new Date(),
                    title: action.title,
                    category: action.category,
                    image: action.image,
                    todoList: []
                }

                console.log(isDataExist[0]);
                console.log(todoDetailsTemp);

                isDataExist[0].todoData.push(todoDetailsTemp);

                console.log(isDataExist[0]);
                console.log(todoDetailsTemp);

                console.log(usersToDoList[dataIndex]);

                usersToDoList[dataIndex] = isDataExist[0];
                console.log(usersToDoList[dataIndex]);

                localStorage.setItem('todoListData', JSON.stringify(usersToDoList));

                todoDetailsTemp.id = JSON.parse(JSON.stringify(todoDetailsTemp.id));

                return {
                    ...state,
                    toDoDetails: todoDetailsTemp
                }
            }
        case actionTypes.EDIT_TODO:
            let usersToDoListEDIT = JSON.parse(localStorage.getItem('todoListData'));

            let emailUsrEDIT = localStorage.getItem('currentUser');
            let dataIndexEDIT = 0;
            let todoListDetailsIndexEDIT = 0;
            let isDataExistEDIT = usersToDoListEDIT?.filter((data, index) => {
                if (data.email === emailUsrEDIT) {
                    dataIndexEDIT = index;
                    return true;
                }
                else {
                    return false;
                }
            });

            let todoDataEDIT = isDataExistEDIT[0].todoData.filter((data, index) => {
                if (data.id === action.listId) {
                    todoListDetailsIndexEDIT = index;
                    return true;
                }
                else {
                    return false;
                }
            })[0];

            todoDataEDIT.title = action.title;
            todoDataEDIT.category = action.category;
            todoDataEDIT.image = action.image;

            isDataExistEDIT[0].todoData[todoListDetailsIndexEDIT] = todoDataEDIT;
            usersToDoListEDIT[dataIndexEDIT] = isDataExistEDIT[0];

            localStorage.setItem('todoListData', JSON.stringify(usersToDoListEDIT));

            return {
                ...state,
                toDoDetails: todoDataEDIT
            }
        case actionTypes.DELETE_TODO:
            let usersToDoListDELETE = JSON.parse(localStorage.getItem('todoListData'));

            let emailUsrDELETE = localStorage.getItem('currentUser');
            let dataIndexDELETE = 0;
            // let todoListDetailsIndexDELETE = 0;
            let isDataExistDELETE = usersToDoListDELETE?.filter((data, index) => {
                if (data.email === emailUsrDELETE) {
                    dataIndexDELETE = index;
                    return true;
                }
                else {
                    return false;
                }
            });

            let todoDataDELETE = isDataExistDELETE[0].todoData.filter((data) => {
                if (data.id !== action.listId) {
                    return true;
                }
                else {
                    return false;
                }
            });

            isDataExistDELETE[0].todoData = todoDataDELETE;
            usersToDoListDELETE[dataIndexDELETE] = isDataExistDELETE[0];

            localStorage.setItem('todoListData', JSON.stringify(usersToDoListDELETE));

            return {
                ...state,
                toDoDetails: [],
            }
        case actionTypes.ADD_TASK:
            let emlAdd = localStorage.getItem('currentUser');
            let todoDataIndex = 0;
            let todoListIndex = 0;
            let todoListDataADD = JSON.parse(localStorage.getItem('todoListData'))
                .filter((data, index) => {
                    if (data.email === emlAdd) {
                        todoDataIndex = index;
                        return true;
                    }
                    return false;
                })[0];
            console.log(todoDataIndex);
            let todoDetailsArrayADD = todoListDataADD.todoData.filter((data, index) => {
                console.log("data : ");
                console.log(data);
                console.log(data.id);
                console.log(action.listId);
                if (data.id === action.listId) {
                    todoListIndex = index;
                    return true;
                }
                return false;
            })[0];
            console.log(todoDetailsArrayADD);

            // Get data from local storage
            let getAllDataADD = JSON.parse(localStorage.getItem('todoListData'));

            let todoTaskData;

            if (todoDetailsArrayADD.todoList.length === 0) {
                console.log("In if")
                // todoDetailsArrayADD.todoList = []
                todoDetailsArrayADD.todoList[0] = { id: new Date(), value: action.task, edit: false }
                todoTaskData = [...todoDetailsArrayADD.todoList]
                // update in variable
                getAllDataADD[todoDataIndex].todoData[todoListIndex].todoList[0] = todoDetailsArrayADD.todoList[0];

                todoTaskData[0].id = JSON.parse(JSON.stringify(todoTaskData[0].id));

            } else {
                console.log("else")
                todoTaskData = todoDetailsArrayADD.todoList.concat({ id: new Date(), value: action.task, edit: false })
                // todoTaskData = [{...todoDetailsArrayADD.todoList}, { id: new Date(), value: action.task, edit: false }]


                // update in variable
                getAllDataADD[todoDataIndex].todoData[todoListIndex].todoList = todoTaskData;
                todoTaskData[todoTaskData.length - 1].id
                    = JSON.parse(JSON.stringify(todoTaskData[todoTaskData.length - 1].id));
            }

            // // update in variable
            // getAllDataADD[todoDataIndex].todoList[todoListIndex].concat(todoTaskData);

            //Update in local storage
            console.log(todoTaskData);
            localStorage.setItem('todoListData', JSON.stringify(getAllDataADD));
            // todoTaskData
            console.log("----------------------------------");
            return {
                ...state,
                tasksList: todoTaskData
            };
        case actionTypes.REMOVE_TASK:
            let emlREMOVE = localStorage.getItem('currentUser');
            let todoDataIndexREMOVE = 0;
            let todoListIndexREMOVE = 0;
            let todoListDataREMOVE = JSON.parse(localStorage.getItem('todoListData'))
                .filter((data, index) => {
                    if (data.email === emlREMOVE) {
                        todoDataIndexREMOVE = index;
                        return true;
                    }
                    return false;
                })[0];
            console.log(todoDataIndexREMOVE);
            let todoDetailsArrayREMOVE = todoListDataREMOVE.todoData.filter((data, index) => {
                console.log("data : ");
                console.log(data);
                console.log("id : " + action.listId);
                if (data.id === action.listId) {
                    todoListIndexREMOVE = index;
                    return true;
                }
                return false;
            })[0];
            console.log(todoDetailsArrayREMOVE);

            // Get data from local storage
            let getAllDataREMOVE = JSON.parse(localStorage.getItem('todoListData'));

            let todoTaskDataREMOVE;

            todoTaskDataREMOVE = todoDetailsArrayREMOVE.todoList.filter(task => task.id !== action.taskElId);
            // update in variable
            getAllDataREMOVE[todoDataIndexREMOVE].todoData[todoListIndexREMOVE].todoList = todoTaskDataREMOVE;

            console.log(todoTaskDataREMOVE);
            localStorage.setItem('todoListData', JSON.stringify(getAllDataREMOVE));
            console.log("----------------------------------");

            // const updatedArray = state.tasksList.filter(task => task.id !== action.taskElId);
            return {
                ...state,
                tasksList: todoTaskDataREMOVE
            }
        case actionTypes.EDIT_TASK:
            let emlEDIT = localStorage.getItem('currentUser');
            let todoDataIndexEDIT = 0;
            let todoListIndexEDIT = 0;
            // let todoTaskId = 0;
            let todoListDataEDIT = JSON.parse(localStorage.getItem('todoListData'))
                .filter((data, index) => {
                    if (data.email === emlEDIT) {
                        todoDataIndexEDIT = index;
                        return true;
                    }
                    return false;
                })[0];

            let todoDetailsArrayEDIT = todoListDataEDIT.todoData.filter((data, index) => {
                if (data.id === action.listId) {
                    todoListIndexEDIT = index;
                    return true;
                }
                return false;
            })[0];

            todoDetailsArrayEDIT = todoDetailsArrayEDIT.todoList.map(task => {
                console.log(task, action.taskElId);
                if (task.id === action.taskElId) {
                    task.value = action.task;
                    task.edit = !task.edit;
                }
                return task;
            });

            // Get data from local storage
            let getAllDataEDIT = JSON.parse(localStorage.getItem('todoListData'));

            // update in variable
            getAllDataEDIT[todoDataIndexEDIT].todoData[todoListIndexEDIT].todoList = todoDetailsArrayEDIT;

            localStorage.setItem('todoListData', JSON.stringify(getAllDataEDIT));
            return {
                ...state,
                tasksList: todoDetailsArrayEDIT
            };

        case actionTypes.EDIT_BTN_ACTIVATE:
            let emlEDITBTN = localStorage.getItem('currentUser');
            let todoDataIndexEDITBTN = 0;
            let todoListIndexEDITBTN = 0;
            console.log(action.taskElId);
            let todoListDataEDITBTN = JSON.parse(localStorage.getItem('todoListData'))
                .filter((data, index) => {
                    if (data.email === emlEDITBTN) {
                        todoDataIndexEDITBTN = index;
                        return true;
                    }
                    return false;
                })[0];

            let todoDetailsArrayEDITBTN = todoListDataEDITBTN.todoData.filter((data, index) => {
                if (data.id === action.listId) {
                    todoListIndexEDITBTN = index;
                    return true;
                }
                return false;
            })[0];

            todoDetailsArrayEDITBTN = todoDetailsArrayEDITBTN.todoList.map(task => {
                console.log(task, action.taskElId);
                if (task.id === action.taskElId) {
                    task.edit = !task.edit;
                }
                else {
                    task.edit = false;
                }
                return task;
            });

            // Get data from local storage
            let getAllDataEDITBTN = JSON.parse(localStorage.getItem('todoListData'));

            // update in variable
            getAllDataEDITBTN[todoDataIndexEDITBTN].todoData[todoListIndexEDITBTN].todoList = todoDetailsArrayEDITBTN;

            localStorage.setItem('todoListData', JSON.stringify(getAllDataEDITBTN));
            return {
                ...state,
                tasksList: todoDetailsArrayEDITBTN
            };

        default:
            return state;
    }
}

export default reducer;