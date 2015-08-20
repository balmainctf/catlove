var profile = {
    resourceTags: {
        ignore: function(filename, mid){
            // only includes moment/moment
            return mid != "moment/moment";
        },
        amd: function(filename, mid){
            return /\.js$/.test(filename);
        }
    }
};
