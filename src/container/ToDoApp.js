import React, { Component } from 'react';
import { connect } from 'react-redux';
import defaultPhoto from '../assets/images/empty-photo.jpg';

import emptyList from '../assets/images/empty-list.png';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';


// import ImageUploader from 'react-images-upload';
// [{"email":"test@yopmail.com"," todoData":[{"id":'1', "title":'Test',"image":"","todoList":[{"id":'123',"task":'Test Task',"edit":false}]}]}]

import classes from './ToDoApp.module.css';
import { Button } from 'react-bootstrap';
import * as actionTypes from '../store/actions';
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
            openErrorSnackbar: false
        };

    }

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
        this.props.deleteTodoList(id);
        this.props.getToDoList();
    }

    titleHandler = (event) => {
        this.setState({ title: event.target.value, inputTitle: true });
    }

    componentDidMount = () => {
        this.setState({ image: defaultPhoto });
        this.props.getToDoList();
        console.log(this.props.toDoList);
        this.setState({ isListEmpty: this.props.toDoList.length === 0 })
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({
                image: URL.createObjectURL(img),
                inputImage: true
            });
        }
        // console.log(this.state.image);

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
        this.props.editTodoList(title, category, image, id);

        this.props.getToDoList();
        this.setState({ isListEmpty: this.props.toDoList.length === 0 })

        this.setState({ title: '', category: 0, image: defaultPhoto, inputTitle: false, inputCategory: false, inputImage: false });
    }

    createTodoHandler = (title, category, image) => {
        if (title === '' || category === 0 || image === defaultPhoto) {
            this.setState({ openErrorSnackbar: true });
        }
        else {
            this.props.createTodoList(title, category, image);
        }
        console.log(this.state.openErrorSnackbar);
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
            return { edit: !prevState.edit, editTask: task }
        });
        this.props.editBtnActivate(id, listId);
        console.log(this.state.edit);
    }

    saveTask = (id, listId) => {
        // this.editHandler('', listId);
        if (this.state.editTask === '') {
            this.setState({ openErrorSnackbar: true });
        }
        else {
            this.props.editTask(id, this.state.editTask, listId);
            this.setState({ editTask: '' });
        }
    }

    getTODOData = (id) => {
        this.props.getToDoDetails(id);
        this.setState({ task: '' });
        console.log(id);
    }

    emptyListHandler = () => {
        this.setState({ isListEmpty: !this.state.isListEmpty });
    }

    addTaskHandler = () => {
        if (this.state.task === '') {
            this.setState({ openErrorSnackbar: true });
        }
        else {
            this.props.addTask(this.state.task, this.props.toDoDetails.id);
            console.log("task : " + this.state.task);
            this.setState({ task: '' });
        }
    }

    editBtnHandler = (id, listId, taskValue) => {
        this.props.editBtnActivate(id, listId);
        this.setState({ editTask: taskValue });
    }

    render() {
        // this.props.getToDoList();
        // console.log(this.props.toDoDetails);
        console.log(this.props.toDoList);
        console.log(this.props.tasks);
        return (
            <div className={classes.MainLayout}>
                <div className={classes.NewTODO}>
                    <Button
                        variant="primary" type="submit"
                        className={classes.btn}
                        startIcon={<AddIcon />}
                        onClick={this.props.resetTodo}>
                        + New TO-DO
                    </Button>
                </div>


                <div className={classes.ToDoAppLayout}>
                    <div className={classes.ToDoList}>

                        {
                            this.props.toDoList.length === 0 ?
                                <>
                                    <img src={emptyList} className={classes.emptyListImage} alt="Please create list" />
                                    <h5> Please create list</h5>
                                </>
                                :
                                < ToDoList todo={this.props.toDoList} clicked={this.getTODOData} deleteTodo={this.handleCloseMenu}/>
                        }
                    </div>
                    <div className={classes.ToDoApp}>
                        {this.props.toDoDetails.length !== 0 ?
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

                                    <MenuItem onClick={() => { this.handleCloseMenu(this.props.toDoDetails.id) }}>
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
                                value={this.props.toDoDetails.length !== 0 && !this.state.inputTitle
                                    ? this.props.toDoDetails.title
                                    : this.state.title}
                                className={classes.addInput}
                                onChange={this.titleHandler} />

                            {/* create */}
                            <Button
                                variant="primary" type="submit"
                                className={classes.btn}
                                onClick={() => {
                                    console.log(this.state.title, this.state.category, this.state.image);
                                    return this.props.toDoDetails.length !== 0 ?
                                        this.editTodoHandler(this.props.toDoDetails.title, this.props.toDoDetails.category, this.props.toDoDetails.image, this.props.toDoDetails.id)
                                        : this.createTodoHandler(this.state.title, this.state.category, this.state.image)
                                }}>
                                {this.props.toDoDetails.length !== 0 ? "Save" : "Create TO DO"}
                            </Button>
                            {/* <input type="file" name="myImage" id="file" className={classes.inputFile} onChange={this.onImageChange}/>
                        <label htmlFor="file">Choose a file</label>  */}
                        </div>

                        <div className={classes.data}>
                            {/* {console.log(this.props.toDoDetails.length === 0 ? true : false)} */}
                            <FormControl variant="filled">
                                <InputLabel id="demo-simple-select-filled-label">Category</InputLabel>
                                <Select className={classes.FormControl}
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={this.props.toDoDetails.length !== 0 && !this.state.inputCategory
                                        ? this.props.toDoDetails.category
                                        : this.state.category}
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
                            {/* {console.log("image : " + this.props.toDoDetails.image, "\nimage : " + this.state.image)} */}
                            <label htmlFor="file" className={classes.imageUploaderBtn}>upload</label>
                            <img htmlFor="file"
                                src={this.props.toDoDetails.length !== 0 && !this.state.inputImage
                                    ? this.props.toDoDetails.image
                                    : this.state.image}
                                className={classes.imagePreview} alt="list" />
                            <input type="file" name="myImage" id="file" className={classes.inputFile} onChange={this.onImageChange} />

                        </div>
                        {
                            this.props.toDoDetails.length !== 0 ?
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
                                        onClick={() => this.addTaskHandler(this.state.task, this.props.toDoDetails.id)}>
                                        Add
                                </Button>
                                </div>
                                :
                                null
                        }
                        <>
                            <ul className={classes.ul}>
                                {this.props.tasks.map(task => (
                                    <li key={task.id}>
                                        <div className={classes.task}>
                                            <div
                                                className={classes.edit}
                                                onClick={() => this.editBtnHandler(task.id, this.props.toDoDetails.id, task.value)} >
                                                <EditIcon />
                                            </div>

                                            <input
                                                className={[classes.taskValue].join(' ')}
                                                value={task.edit ? this.state.editTask : task.value}
                                                disabled={!task.edit}
                                                onChange={this.editTaskHandler} />

                                            {
                                                !task.edit ?
                                                    <div
                                                        className={classes.delete}
                                                        onClick={() => this.props.deleteTask(task.id, this.props.toDoDetails.id)}>
                                                        <DeleteIcon />
                                                    </div>
                                                    :
                                                    <>
                                                        <div
                                                            className={classes.cancel}
                                                            onClick={() => this.editHandler(task.value, task.id, this.props.toDoDetails.id)}>
                                                            <CancelIcon />
                                                        </div>
                                                        <div
                                                            className={classes.save}
                                                            onClick={() => this.saveTask(task.id, this.props.toDoDetails.id)}>
                                                            <SaveIcon />
                                                        </div>
                                                    </>
                                            }
                                        </div>
                                    </li>
                                ))}
                            </ul>
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
        tasks: state.todoList.tasksList,
        toDoDetails: state.todoList.toDoDetails,
        toDoList: state.todoList.todoLists
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addTask: (task, id) => {
            // console.log(task);
            return dispatch({ type: actionTypes.ADD_TASK, task: task, listId: id })
        },
        deleteTask: (id, listId) => dispatch({ type: actionTypes.REMOVE_TASK, taskElId: id, listId: listId }),
        editTask: (id, task, listId) => dispatch({ type: actionTypes.EDIT_TASK, taskElId: id, task: task, listId: listId }),
        editBtnActivate: (id, listId) => dispatch({ type: actionTypes.EDIT_BTN_ACTIVATE, taskElId: id, listId: listId }),
        createTodoList: (titlePara, categoryPara, imagePara) => {
            console.log("title  : " + titlePara, categoryPara, imagePara);

            return dispatch({ type: actionTypes.CREATE_TODO, title: titlePara, category: categoryPara, image: imagePara })
        },
        editTodoList: (titlePara, categoryPara, imagePara, id) => {
            // console.log("title  : " + titlePara, categoryPara, imagePara)
            return dispatch({ type: actionTypes.EDIT_TODO, title: titlePara, category: categoryPara, image: imagePara, listId: id })
        },
        deleteTodoList: (id) => {
            return dispatch({ type: actionTypes.DELETE_TODO, listId: id })
        },
        getToDoList: () => dispatch({ type: actionTypes.GET_TODO_LIST }),
        getToDoDetails: (id) => dispatch({ type: actionTypes.GET_TODO_DETAILS, id: id }),
        resetTodo: () => dispatch({ type: actionTypes.RESET_TODO }),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToDoApp);