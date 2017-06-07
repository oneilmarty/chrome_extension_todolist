TaskRepository = function() {
	this.init();
	return this;
};

TaskRepository.prototype = {
    tasks: [],
    index: 0,

    init: function() {
        this.load();
    },

    getById: function(id) {
        return this.tasks.filter(function(t) { return t.id == id; })[0];
    },

    create: function(task) {
        if (task == null) throw new TypeError('Missing task parameter');

        task.id = this.index++;

        this.tasks.push(task);
        this.save();
    },

    remove: function(task) {
        if (task == null) throw new TypeError('Missing task parameter');
        if (task.id == null) throw new TypeError('Missing task.id property');
        var self = this;

        this.tasks.forEach(function(t, i) {
            if (t.id == task.id) self.tasks.splice(i, 1);
        });

        this.save();
    },

    load: function() {
        this.tasks = (localStorage.tasks ? JSON.parse(localStorage.tasks) : []);
        this.index = localStorage.index ? localStorage.index : 0;
    },

    save: function() {
        localStorage.tasks = this.tasks ? JSON.stringify(this.tasks) : null;
        localStorage.index = this.index;
    }
};

View = function() { return this; }
View.prototype = {
    init: function() {
        // Manually create a task. This will happen each time you reload the popup
        db.create({
            title: 'My first task is to make a task',
            completed: false,
            created: new Date()
        });
        this.renderView();
    },

    renderView: function() {
        // Tells jsTemplate to load our tasks and display them with our template
        jstProcess(new JsEvalContext(db.tasks), document.getElementById('results'));
    }
};

var db = new TaskRepository();
var view = new View();

window.onload = function() { view.init(); };