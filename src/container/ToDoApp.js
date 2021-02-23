import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from "redux";
import * as crudAction from '../storeUtils/actions/crudActions';

import defaultPhoto from '../assets/images/empty-photo.jpg';

import emptyList from '../assets/images/empty-list.png';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import classes from './ToDoApp.module.css';
import { Button } from 'react-bootstrap';
import DeleteIcon from '@material-ui/icons/Delete';
import CancelIcon from '@material-ui/icons/Cancel';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import ToDoList from '../components/ToDoList/ToDoList';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';

class ToDoApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            task: '',
            edit: false,
            editTask: '',
            image: defaultPhoto,
            category: 0,
            title: '',
            isListEmpty: true,
            anchorEl: null,
            inputTitle: false,
            inputCategory: false,
            inputImage: false,
            inputTask: false,
            openErrorSnackbar: false,
            userID: localStorage.getItem('currentUser'),
            todoListId: null,
            editedID: null
        };
        this.getTodoList = this.getTodoList.bind(this);
        this.handleCloseMenu = this.handleCloseMenu.bind(this);
    }


    static timer;

    errorHandleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openErrorSnackbar: false });

    };

    handleMenuClick = (event) => {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleCloseMenu = (id) => {
        this.setState({ anchorEl: null });
        let deleteTodoData = {
            id: id,
            user_id: this.state.userID
        }
        this.props.actions.postAll('deleteTodo', deleteTodoData, 'deleteTodo');
        this.props.actions.resetTodo();
        this.setState({ title: '', category: 0, image: defaultPhoto, inputTitle: false, inputCategory: false, inputImage: false, todoListId: null });
        // console.log(this.props.toDoDetails);
        // console.log(this.state.title, this.state.category, this.state.image, this.state.inputTitle, this.state.inputCategory, this.state.inputImage, this.state.todoListId)
    }

    titleHandler = (event) => {
        this.setState({ title: event.target.value, inputTitle: true });
    }

    componentWillUnmount = () => {
        this.setState({ title: '', category: 0, image: defaultPhoto, inputTitle: false, inputCategory: false, inputImage: false });
        this.props.actions.resetTodo();
    }

    componentDidMount() {
        this.setState({ image: defaultPhoto });
        // console.log("user : " + this.state.userID);

        this.setState({ isListEmpty: this.props.toDoList.data.length === 0, userID: localStorage.getItem('currentUser') })
        this.getTodoList();
        // console.log(this.props.toDoList);
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            console.log(event.target.files)
            let img = event.target.files[0];
            this.setState({
                image: URL.createObjectURL(img),
                inputImage: true,
                img: img
            });
            console.log(img.name);
            console.log(this.state.image);
        }
        //console.log(this.state.image);

    };

    editTodoHandler = (title, category, image, id) => {
        if (this.state.title !== '') {
            title = this.state.title
        }
        if (this.state.category !== 0) {
            category = this.state.category
        }
        if (this.state.image !== defaultPhoto) {
            image = this.state.image
        }

        let editTodoData = {
            id: id,
            user_id: this.state.userID,
            title: title,
            category: category,
            image: image
        }

        this.props.actions.postAll('updateTodo', editTodoData, 'updateTodo');
        // this.setState({ isListEmpty: this.props.toDoList.data.length === 0 })
    }

    componentWillReceiveProps(nextProps) {
        // //console.log(nextProps.deleteTodo);
        if (nextProps.updateTodo && nextProps.updateTodo.success && nextProps.updateTodo?.success !== this.props.updateTodo?.success) {
            this.getTodoList();
            this.getTODOData(0);
            this.props.actions.makeReduxNull("updateTodo", false)
            if (nextProps.toDoDetails && nextProps.toDoDetails.success && nextProps.toDoDetails?.success !== this.props.toDoDetails?.success) {
                this.setState({
                    title: '',
                    category: 0,
                    image: defaultPhoto,
                    inputTitle: false,
                    inputCategory: false,
                    inputImage: false,
                });
            }
            console.log(this.state.todoListId);
        }
        if (nextProps.deleteTodo && nextProps.deleteTodo.success && nextProps.deleteTodo?.success !== this.props.deleteTodo?.success) {
            this.getTodoList();
            this.props.actions.makeReduxNull("deleteTodo", false)
        }
        if (nextProps.toDoDetails && nextProps.toDoDetails.success && nextProps.toDoDetails?.success !== this.props.toDoDetails?.success) {
            console.log("2");
            this.setState({ todoListId: nextProps.toDoDetails.data.id })
            console.log(nextProps.toDoDetails)
            this.getTodoList();
            this.getTodoDetails();
        }
        if (nextProps.addTask && nextProps.addTask.success && nextProps.addTask?.success !== this.props.addTask?.success) {
            this.getTODOData(0);
            this.props.actions.makeReduxNull("addTask", false)
        }
        if (nextProps.deleteTask && nextProps.deleteTask.success && nextProps.deleteTask?.success !== this.props.deleteTask?.success) {
            this.getTODOData(0);
            this.props.actions.makeReduxNull("deleteTask", false)
        }
        if (nextProps.editTask && nextProps.editTask.success && nextProps.editTask?.success !== this.props.editTask?.success) {
            this.getTODOData(0);
            this.props.actions.makeReduxNull("editTask", false)
        }
    }

    getTodoList = () => {
        // setTimeout(() => {
        this.props.actions.postAll('getTodo', { user_id: localStorage.getItem('currentUser') }, 'toDoList');
        // }, 1000);
    }

    createTodoHandler = (title, category, image) => {
        if (title === '' || category === 0 || image === defaultPhoto) {
            this.setState({ openErrorSnackbar: true });
        }
        else {
            //console.log("UserId add : " + this.state.userID);
            let addTodoData = {
                user_id: this.state.userID,
                title: title,
                category: category,
                image: image
            }

            //console.log("Add");
            this.props.actions.postAll('addTodo', addTodoData, 'toDoDetails');
            console.log("1");
        }

        //console.log(this.state.openErrorSnackbar);
    }

    taskChangeHandler = (event) => {
        this.setState({ task: event.target.value });
    }

    editTaskHandler = (event) => {
        this.setState({ editTask: event.target.value });
    }

    categoryHandleChange = (event) => {
        this.setState({ category: event.target.value, inputCategory: true });
    };

    editHandler = (task, id, listId) => {
        this.setState((prevState) => {
            return { editedID: null, editTask: task }
        });
        // this.props.editBtnActivate(id, listId);
        //console.log(this.state.edit);
    }

    saveTask = (id, listId) => {
        // this.editHandler('', listId);
        if (this.state.editTask === '') {
            this.setState({ openErrorSnackbar: true });
        }
        else {
            // this.props.editTask(id, this.state.editTask, listId);
            let editTaskData = {
                user_id: this.state.userID,
                title: this.state.editTask,
                id: id
            }

            this.props.actions.postAll('updateNestedTodo', editTaskData, 'editTask');
            this.setState({ editTask: '', editedID: null });
        }
    }

    getTODOData = (id) => {
        this.setState({ title: '', category: 0, image: defaultPhoto, inputTitle: false, inputCategory: false, inputImage: false });
        if (id === 0) {
            id = this.state.todoListId
        }
        else {
            this.setState({ todoListId: id });
        }
        console.log(id);
        // this.props.getToDoDetails(id);
        let getTodoData = {
            todo_id: id
        }

        this.props.actions.postAll('getTodoData', getTodoData, 'toDoDetails');
        this.setState({ task: '', editedID: null });
    }

    emptyListHandler = () => {
        this.setState({ isListEmpty: !this.state.isListEmpty });
    }

    addTaskHandler = (task, todoId) => {
        if (this.state.task === '') {
            this.setState({ openErrorSnackbar: true });
        }
        else {
            // this.props.addTask(this.state.task, this.props.toDoDetails.id);
            //console.log("task : " + this.state.task);
            let addTaskData = {
                user_id: this.state.userID,
                title: task,
                todo_id: todoId
            }

            this.props.actions.postAll('addNestedTodo', addTaskData, 'addTask');

        }
    }

    editBtnHandler = (id, listId, taskValue) => {
        // this.props.editBtnActivate(id, listId);
        this.setState({ editedID: id, editTask: taskValue });
        //console.log(id, this.state.editedID)
    }

    deleteTaskHandler = (taskId) => {
        let deleteTaskData = {
            user_id: this.state.userID,
            id: taskId
        }

        this.props.actions.postAll('deleteNestedTodo', deleteTaskData, 'deleteTask');
    }

    resetTodo = () => {
        this.props.actions.resetTodo();
        this.setState({
            title: '',
            category: 0, image:
                defaultPhoto,
            inputTitle: false,
            inputCategory: false,
            inputImage: false,
            editedID: null
        });
    }

    getTodoDetails = () => {
        console.log("3");
        console.log(this.props.toDoDetails);
        console.log(this.state.todoListId);
        if (this.state.todoListId === null && this.props.toDoDetails.data.length !== 0) {
            console.log(this.props.toDoDetails);
            console.log(this.state.todoListId);
            this.setState({ todoListId: this.props.toDoDetails.data.id })
        }
    }

    render() {
        // console.log(this.props.toDoList.data.length === 0);
        // console.log(this.props.toDoList.data)
        console.log(this.props.toDoDetails);

        //console.log(this.props.tasks);
        //console.log(this.state.title, this.state.image, this.state.category);

        return (
            <div className={classes.MainLayout}>
                <div className={classes.NewTODO}>
                    <Button
                        variant="primary" type="submit"
                        className={classes.btn}
                        starticon={<AddIcon />}
                        onClick={this.resetTodo}>
                        + New TO-DO
                    </Button>
                </div>

                <div className={classes.ToDoAppLayout}>
                    <div className={classes.ToDoList}>

                        {
                            this.props.toDoList.data === undefined ?
                                <h5> Please wait a some time</h5>
                                : this.props.toDoList.data.length === 0 ?
                                    <>
                                        <img src={emptyList} className={classes.emptyListImage} alt="Please create list" />
                                        <h5> Please create list</h5>
                                    </>
                                    :
                                    <ToDoList todo={this.props.toDoList.data} clicked={this.getTODOData} deleteTodo={this.handleCloseMenu} />
                        }
                    </div>
                    <div className={classes.ToDoApp}>
                        {this.props.toDoDetails.data.length !== 0 ?
                            <div
                                className={classes.MoreVertLayout}
                            // onClick={(}
                            >
                                <MoreVertIcon className={classes.MoreVert} onClick={this.handleMenuClick} />
                                <Menu
                                    id="simple-menu"
                                    anchorEl={this.state.anchorEl}
                                    keepMounted
                                    open={Boolean(this.state.anchorEl)}
                                    onClose={this.handleCloseMenu} >

                                    <MenuItem onClick={() => { this.handleCloseMenu(this.props.toDoDetails.data.id) }}>
                                        Delete
                                    </MenuItem>
                                </Menu>
                            </div>
                            : null
                        }
                        <div className={classes.add}>
                            {/* title */}
                            <input
                                type="text"
                                name="title"
                                placeholder="Title"
                                value={this.props.toDoDetails.data.length !== 0 && !this.state.inputTitle
                                    ? this.props.toDoDetails.data.title
                                    : this.state.title}
                                className={classes.addInput}
                                onChange={this.titleHandler} />

                            {/* create */}
                            <Button
                                variant="primary" type="submit"
                                className={classes.btn}
                                onClick={() => {
                                    //console.log(this.state.title, this.state.category, this.state.image);
                                    return this.props.toDoDetails.data.length !== 0 ?
                                        this.editTodoHandler(this.props.toDoDetails.data.title,
                                            this.props.toDoDetails.data.category,
                                            this.props.toDoDetails.data.image,
                                            this.props.toDoDetails.data.id)
                                        : this.createTodoHandler(this.state.title, this.state.category, this.state.image)
                                }}>
                                {
                                    this.props.toDoDetails.data.length !== 0 ? "Save" : "Create TO DO"}
                            </Button>
                            {/* <input type="file" name="myImage" id="file" className={classes.inputFile} onChange={this.onImageChange}/>
                        <label htmlFor="file">Choose a file</label>  */}
                        </div>

                        <div className={classes.data}>
                            {/* {console.log(this.props.toDoDetails.data.length === 0 ? true : false)} */}
                            <FormControl variant="filled">
                                <InputLabel id="demo-simple-select-filled-label">Category</InputLabel>
                                <Select className={classes.FormControl}
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={
                                        this.props.toDoDetails.data.length !== 0 && !this.state.inputCategory
                                            ? this.props.toDoDetails.data.category :
                                            this.state.category}
                                    onChange={this.categoryHandleChange}
                                >
                                    <MenuItem value="" >
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value={1}>Home</MenuItem>
                                    <MenuItem value={2}>Office</MenuItem>
                                    <MenuItem value={3}>College</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Image */}
                            {/* {console.log("image : " + this.props.toDoDetails.data.image, "\nimage : " + this.state.image)} */}
                            <label htmlFor="file" className={classes.imageUploaderBtn}>upload</label>
                            <img htmlFor="file"
                                src={
                                    this.props.toDoDetails.data.length !== 0 && !this.state.inputImage
                                        ? this.props.toDoDetails.data.image :
                                        this.state.image}
                                className={classes.imagePreview} alt="list" />
                            <input type="file" name="myImage" id="file" className={classes.inputFile} onChange={this.onImageChange} />

                        </div>
                        {
                            this.props.toDoDetails.data.length !== 0 ?
                                <div className={classes.addTaskLayout}>

                                    {/* add input */}
                                    <input
                                        type="text"
                                        name="task"
                                        placeholder="todo"
                                        value={this.state.task}
                                        className={classes.addInput}
                                        onChange={this.taskChangeHandler}
                                        ref={(input) => this.myInput = input} />

                                    {/* add button */}
                                    <Button
                                        variant="primary" type="submit"
                                        className={classes.btn}
                                        onClick={() => this.addTaskHandler(this.state.task, this.props.toDoDetails.data.id)}>
                                        Add
                                </Button>
                                </div>
                                :
                                null
                        }
                        <>
                            {
                                this.props.toDoDetails.data.length !== 0 ?
                                    this.props.toDoDetails.data.Nested_todoes.length !== 0 ?
                                        <ul className={classes.ul}>
                                            {this.props.toDoDetails.data.Nested_todoes.map(task => (
                                                <li key={task.id}>
                                                    <div className={classes.task}>
                                                        <div
                                                            className={classes.edit}
                                                            onClick={() => this.editBtnHandler(task.id, this.props.toDoDetails.data.id, task.title)} >
                                                            <EditIcon />
                                                        </div>

                                                        <input
                                                            className={[classes.taskValue].join(' ')}
                                                            value={this.state.editedID === task.id ? this.state.editTask : task.title}
                                                            disabled={this.state.editedID !== task.id}
                                                            onChange={this.editTaskHandler} />

                                                        {
                                                            this.state.editedID !== task.id ?
                                                                <div
                                                                    className={classes.delete}
                                                                    onClick={() => this.deleteTaskHandler(task.id)}>
                                                                    <DeleteIcon />
                                                                </div>
                                                                :
                                                                <>
                                                                    <div
                                                                        className={classes.cancel}
                                                                        onClick={() => this.editHandler(task.title, task.id, this.props.toDoDetails.data.id)}>
                                                                        <CancelIcon />
                                                                    </div>
                                                                    <div
                                                                        className={classes.save}
                                                                        onClick={() => this.saveTask(task.id, this.props.toDoDetails.data.id)}>
                                                                        <SaveIcon />
                                                                    </div>
                                                                </>
                                                        }
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        : null
                                    : null
                            }
                        </>
                    </div>
                </div>
                <Snackbar className={classes.snackbar} open={this.state.openErrorSnackbar} autoHideDuration={6000} onClose={this.errorHandleClose}>
                    <Alert onClose={this.errorHandleClose} severity="error">Please fill the fields</Alert>
                </Snackbar>
            </div>
        );
    }

}
const mapStateToProps = state => {
    return {
        tasks: state.crud.tasks,
        toDoDetails: state.crud.toDoDetails,
        toDoList: state.crud.toDoList,
        deleteTodo: state.crud.deleteTodo,
        updateTodo: state.crud.updateTodo,
        // toDoList: state.crud.toDoList,
        addTask: state.crud.addTask,
        deleteTask: state.crud.deleteTask,
        editTask: state.crud.editTask,
    };
}

const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators(
        Object.assign({}, crudAction),
        dispatch
    ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ToDoApp);