var constants = {
    letters : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    avatars: {
        'M': 'http://howlstream.com/dist/images/icons/PNG/Dude.png',
        'F': 'http://howlstream.com/dist/images/icons/PNG/Girl.png'
    },
    ageColors: {
        average: {},
        minor: {
            'background-color': 'red',
                color: 'white'
        },
        senior: {
            'background-color': 'brown',
                color: 'yellow'
        }
    }
};

var helpers = {
    randomGender: function() {
        return (Math.floor(Math.random() * 2) % 2 === 0) ? 'M' : 'F';
    },

    randomAge: function() {
        return Math.floor(Math.random() * 90) + 1;
    },

    randomName: function(length) {
        var nome = "";
        for (var i = 0; i < length; i++)
            nome += constants.letters.charAt(Math.floor(Math.random() * constants.letters.length));
        return nome;
    },

    randomUrl: function() {
        return (Math.floor(Math.random() * 2) % 2 === 0) ? 'http://www.' + (helpers.randomName(20) + '.' + helpers.randomName(2)).toLowerCase() : '';
    }
};

var PeopleViewModel = function(){
    this._people = [];

    this.people = js.observableList();
    this.filter = js.observableValue();

    this.loadPeople = function(number) {
        var gender = '?';
        this._people = [];
        for (var i = 0; i < number; i++) {
            gender = helpers.randomGender();
            this._people.push({
                firstname: helpers.randomName(8),
                lastname: helpers.randomName(8),
                age: helpers.randomAge(),
                gender: gender,
                picture: constants.avatars[gender],
                url: helpers.randomUrl()
            });
        }

        this.people.setValue(this._people);
    };

    this.initState = function(){
        var that = this;
        this.filter.listen(function(filter){
            var filtered = [];
            for (var i = 0; i < that._people.length; i++) {
                var person = that._people[i];
                if (person.firstname.indexOf(filter) > -1) {
                    filtered.push(person);
                }
            }

            that.people.setValue(filtered);
        });

        this.loadPeople(2000);
    };
};

var PeopleView = function(){
    this.template = '#People';
    this.init = function(dom, viewModel){
        dom('tbody').observes(viewModel.people, PersonView);
        dom('#filter').observes(viewModel.filter, { event: 'keyup' });
    };
};

var PersonView = function(){
    this.template = '#Person';
    this.init = function(dom, viewModel){
        dom('.firstname').observes(viewModel.firstname);
    };
};

js.dom('#app').render(PeopleView, new PeopleViewModel());