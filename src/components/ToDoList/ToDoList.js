import React from 'react';
import classes from './ToDoList.module.css';
import DeleteIcon from '@material-ui/icons/Delete';


const toDoList = (props) => {
    // console.log(props.todo);
    return (
        <div className={classes.ToDoList}>
            <ul>
                {
                    props.todo.map((todo, index) =>
                        <div key={index} >
                            <li className={classes.listTitle} >
                                <p className={classes.title} onClick={() => props.clicked(todo.id)}>{todo.title}</p>
                                <div
                                    className={classes.delete}
                                    onClick={() => props.deleteTodo(todo.id)}>
                                    <DeleteIcon />
                                </div>
                            </li>

                            <hr />
                        </div>
                    )
                }
            </ul>
        </div >
    );
}

export default toDoList;