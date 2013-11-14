/*
 * Model
 *   model is a primary application
 *   state storage */

var FILE = "file";
var DIRECTORY = "directory";

var File = function(name, type, children){
    this.name = name;
    this.type = type;
    this.children = children;
    this.isDirectory = type === DIRECTORY;
    this.parent = null;

    this.hasChildren = function(){
        if (this.children){
            return true;
        }
    };

    this.setParent = function(parent){
        this.parent = parent;
    };

    this.getFullPath = function(){
        if (this.parent === null) {
            return this.name;
        }

        return this.parent.getFullPath() + "\\" + this.name;
    };

    if (this.hasChildren()){
        for (var i = 0; i < this.children.length; i++){
            this.children[i].setParent(this);
        }
    }
};

var FileSystem = function(){
    this._root = [
        new File("C:\\", DIRECTORY, [
            new File("Users", DIRECTORY, [
                new File("John Smith", DIRECTORY,[])
            ]),
            new File("Windows", DIRECTORY, []),
            new File("todo.txt", FILE, null)
        ]),
        new File("D:\\", DIRECTORY, [])
    ];

    this.getRoot = function(){
        return this._root;
    };
};

/*
 * ViewModel
 *    view model works with Model and
 *    adapts it's properties for View */

var FileViewModel = function(file){
    this.children = js.bindableList();
    this.name = file.name;
    this.isDirectory = file.isDirectory;

    if (file.hasChildren()) {
        for (var i = 0; i < file.children.length; i++) {
            var child = file.children[i];
            var childViewModel = new FileViewModel(child);

            this.children.add(childViewModel);
        }
    }

    this.showFullPath = function(){
        alert(file.getFullPath());
    };
};

var FileSystemViewModel = function(fileSystem){
    this.fileTree = js.bindableList();

    this.initState = function(){
        var drives = fileSystem.getRoot();
        for (var i = 0; i < drives.length; i++){
            var drive = drives[i];
            var driveViewModel = new FileViewModel(drive);

            this.fileTree.add(driveViewModel);
        }
    };
};

/*
 * View
 *    view consumes ViewModel bindable properties
 *    and wires it to the markup */

var FileView = function(){
    this.template =
        "<li class='item'>" +
            "<a href='#' class='name'></a>" +
            "<ul class='children'></ul>" +
        "</li>";

    this.init = function(fileViewModel){
        if (fileViewModel.isDirectory) {
            this.find(".item").addClass("directory");
        }

        this.bind(fileViewModel.name).to(".name");
        this.bind(fileViewModel.children).to(".children", FileView);

        this.on("a", "click").do(fileViewModel.showFullPath);
    };
};

var FileTreeView = function(){
    this.template = "#FileSystemTemplate";
    this.init = function(fileSystemViewModel){
        this.bind(fileSystemViewModel.fileTree).to("#treeRoot", FileView);
    };
};

/* Putting it all together */

var fileSystem = new FileSystem();
var fileSystemViewModel = new FileSystemViewModel(fileSystem);

js.renderView(FileTreeView, fileSystemViewModel).to("#fileTree");