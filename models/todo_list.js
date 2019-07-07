class ToDoList {
    constructor(listOfItems) {
        this._listOfItems = listOfItems;

        this.getToDoList = () => {
            return this._listOfItems;
        };

        this.addItem = (item) => {
            this._listOfItems.push(item);
        };

        this.deleteItem = (item) => {
            this._listOfItems = this._listOfItems.filter((elem) => {
                return elem != item;
            });
        };

        this.hasItem = (item) => {
            return this._listOfItems.indexOf(item) > -1;
        };

        this.deleteToDoList = () => {
            this._listOfItems = [];
        };
    }
};

module.exports = ToDoList;