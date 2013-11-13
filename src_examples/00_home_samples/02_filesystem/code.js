/* Model */
var FILE = "file";
var DIRECTORY = "directory";

var FileSystemItem = function(name, type, children){
    this.name = name;
    this.type = type;
    this.children = children;
    this.isDirectory = type === DIRECTORY;

    this.hasChildren = function(){
        if (this.children){
            return true;
        }
    };
};

var FileSystem = function(){
    this._root = [
        new FileSystemItem("C:\\", DIRECTORY, [
            new FileSystemItem("Users", DIRECTORY, [
                new FileSystemItem("John Smith", DIRECTORY,[])
            ]),
            new FileSystemItem("Windows", DIRECTORY, []),
            new FileSystemItem("todo.txt", FILE)
        ]),
        new FileSystemItem("D:\\", DIRECTORY, [])
    ];

    this.getRoot = function(){
        return this._root;
    };
};

/* ViewModel */

var FileSystemItemViewModel = function(fileSystemItem, fileSystem){
    this.childrenFiles = js.bindableList();
    this.childrenDirectories = js.bindableList();
    this.name = fileSystemItem.name;

    if (fileSystemItem.hasChildren()) {
        for (var i = 0; i < fileSystemItem.children.length; i++) {
            var child = fileSystemItem.children[i];
            var childViewModel = new FileSystemItemViewModel(child, fileSystem);
            if (child.isDirectory){
                this.childrenDirectories.add(childViewModel);
            } else {
                this.childrenFiles.add(childViewModel);
            }
        }
    }

    this.select = function(){
        fileSystem.setCurrentDirectory(this);
    };
};

var FileSystemViewModel = function(fileSystem){
    this.fileSystem = fileSystem;

    this.currentDirectory = js.bindableValue();
    this.fileTree = js.bindableList();
    this.currentPathFiles = js.bindableList();

    this.initState = function(){
        var drives = this.fileSystem.getRoot();
        for (var i = 0; i < drives.length; i++){
            var drive = drives[i];
            var driveViewModel = new FileSystemItemViewModel(drive, this);

            this.fileTree.add(driveViewModel);
            this.currentPathFiles.add(driveViewModel);
        }
    };

    this.setCurrentDirectory = function(directoryViewModel){
        console.log(directoryViewModel);

        this.currentDirectory.setValue(directoryViewModel.name);
        this.currentPathFiles.clear();
        directoryViewModel.childrenDirectories.forEach(function(item){
            this.currentPathFiles.add(item);
        }, this);
        directoryViewModel.childrenFiles.forEach(function(item){
            this.currentPathFiles.add(item);
        }, this);
    };
};

/* View */
var FileWithChildrenView = function(){
    this.template =
        "<li class='file'>" +
            "<a href='#' class='name'></a>" +
            "<ul class='children'></ul>" +
        "</li>";

    this.init = function(fileViewModel){
        this.on("a", "click").do(fileViewModel.select);

        this.bind(fileViewModel.name).to(".name");
        this.bind(fileViewModel.childrenDirectories).to(".children", FileWithChildrenView);

        console.log(fileViewModel);


    };
};

var FileView = function(){
    this.template =
        "<li class='file'>" +
            "<span class='name'></span>" +
        "</li>";

    this.init = function(fileViewModel){
        this.bind(fileViewModel.name).to(".name");
    };
};

var FileTreeView = function(){
    this.template = "#FileSystemTemplate";
    this.init = function(fileSystemViewModel){
        this.bind(fileSystemViewModel.fileTree).to("#fileTree", FileWithChildrenView);
        this.bind(fileSystemViewModel.currentPathFiles).to("#currentDirectory", FileView);
        this.bind(fileSystemViewModel.currentDirectory).to("h2");
    };
};

/* Putting it all together */

var fileSystem = new FileSystem();
var fileSystemViewModel = new FileSystemViewModel(fileSystem);

js.renderView(FileTreeView, fileSystemViewModel).to("#fileSystem");