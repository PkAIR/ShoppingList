const uuid = require('uuid');

class ToDoList {
    constructor(dictOfItems) {
        this._dictOfItems = dictOfItems;

        this.getToDoList = () => {
            return this._dictOfItems;
        };

        this.addItem = (item) => {
            this._dictOfItems.push({
                key: uuid.v1(),
                value: item
            });
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