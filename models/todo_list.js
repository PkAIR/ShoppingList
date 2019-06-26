function ToDoList(listOfItems) {
    this._listOfItems = listOfItems;
    
    this.getToDoList = () => {
        return this._listOfItems;
    }

    this.addItem = (item) => {
        this._listOfItems.push(item);
    }

    this.deleteItem = () => {
        this._listOfItems = this._listOfItems.filter(function(item, index, arr) {
            value === item;
        });
    }

    this.deleteToDoList = () => {
        this._listOfItems = [];
    }
}