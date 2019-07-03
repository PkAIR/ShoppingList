const uuid = require('uuid');

class ToDoList {
    constructor(dictOfItems) {
        this._dictOfItems = dictOfItems;

        this.getToDoList = () => {
            return this._dictOfItems;
        };

        this.addItem = (key, value) => {
            this._dictOfItems[key] = value;
        };

        this.deleteItem = (item) => {
            delete this._dictOfItems[item]
        };

        this.hasItem = (item) => {
            return item in this._dictOfItems;
        };

        this.deleteToDoList = () => {
            this._dictOfItems = {};
        };
    }
};

module.exports = ToDoList;