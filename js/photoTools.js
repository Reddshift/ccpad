var photoTools = photoTools || {};
photoTools.flickr = photoTools.flickr || {};
//hash of galleries on current page
photoTools.galleries = photoTools.galleries || {}; 
photoTools.flickr.api_key = "e9c269dab327f845d9ab34045f9db905";

photoTools.load_galleries = function(gallery_array) {
  $.each(gallery_array, function(i, gallery){
    photoTools.galleries[gallery[1]] = new Gallery(gallery[0], gallery[1]);
    photoTools.galleries[gallery[1]].load_set();
  });
}

photoTools.ready_galleries = function() {
  var all_ready = true;
  $.each(photoTools.galleries, function(i,gallery) {
    if (!gallery.ready) all_ready = false; 
  });
  if (all_ready) {
    $(function() { $('.touch_gallery a').touchTouch();});
  }
}


//class for managing galleries
var Gallery = function(photoset_id, gallery_id) {
  this.gallery_id = gallery_id;
  this.photoset_id = photoset_id
  this.setLength = 0;
  this.rendered_count = 0
  this.rendered_ids = [];
  this.ready = false;
}

Gallery.prototype = {
  load_set : function() {
    var self = this;
    $.getJSON("http://api.flickr.com/services/rest/?",
      {method: "flickr.photosets.getPhotos", api_key: photoTools.flickr.api_key, photoset_id: this.photoset_id, format: "json", nojsoncallback : "1" }
    ).done(function(set) {self.process_set(set);}
    ).fail(function(json) {alert("Failed to load Photo Set");});
  },

  /*
  process_set : function(set) {
    this.setLength = set.photoset.photo.length;
    $.each(set.photoset.photo, function(i,photo){
      $.getJSON("http://api.flickr.com/services/rest/?",
        {method: "flickr.photos.getSizes", api_key: photoTools.flickr.api_key, photo_id: photo.id, format: "json", nojsoncallback : "1"  }
      ).done(this.process_sizes
      ).fail(function(json) {alert("Failed to load sizes for set");});
    });
  },
  */
  process_set : function(set) {
    var self = this;
    this.setLength = set.photoset.photo.length;
    $.each(set.photoset.photo, function(i, photo) {self.fetch_sizes(photo)});
  },

  fetch_sizes : function(flickr_photo) {      
    var self = this;
    $.getJSON("http://api.flickr.com/services/rest/?",
      {method: "flickr.photos.getSizes", api_key: photoTools.flickr.api_key, photo_id: flickr_photo.id, format: "json", nojsoncallback : "1"  }
    ).done(function(sizeobj) {self.process_sizes(sizeobj, flickr_photo.id);}
    ).fail(function(json) {alert("Failed to load sizes for set");});
  },

  process_sizes : function(sizeobject, photo_id) {
    sizeHash = photoTools.getSizeHash(sizeobject.sizes.size);
    this.add_to_gallery(sizeHash.Thumbnail, sizeHash.Original, photo_id);
  },

  add_to_gallery : function(thumb, full, photo_id) {
    var link = $("<a/>").attr({href : full});
    var thumb = $("<img/>").attr({src : thumb}).appendTo('#' + this.gallery_id);
    link.appendTo('#' + this.gallery_id);
    thumb.appendTo(link);
    this.log_rendered(photo_id);
  },

  log_rendered : function(photo_id) {
    this.rendered_count++;
    this.rendered_ids.push(photo_id); 
    if(this.rendered_count == this.setLength) {
      this.ready = true;
      photoTools.ready_galleries();
    }
  }
};


photoTools.getSizeHash = function(available) {
  var sizes = {};
  $.each(available, function(i, size) {
    sizes[size.label] = size.source;
  });
  return sizes;
};

