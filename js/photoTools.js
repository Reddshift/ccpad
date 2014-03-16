var photoTools = photoTools || {};
photoTools.flickr = photoTools.flickr || {};
//hash of galleries on current page
photoTools.galleries = photoTools.galleries || {}; 
photoTools.flickr.api_key = "e9c269dab327f845d9ab34045f9db905";

//class for managing galleries
var Gallery = function(photoset_id, gallery_id) {
  this.gallery_id = gallery_id;
  this.photoset_id = photoset_id
  this.setLength = 0;
  this.rendered_count = 0
  this.rendered_ids = [];
}

Gallery.prototype = {
  load_set : function() {
    gallery_ref = this; //pretty sure there is a better way to do this....
    $.getJSON("http://api.flickr.com/services/rest/?",
      {method: "flickr.photosets.getPhotos", api_key: photoTools.flickr.api_key, photoset_id: this.photoset_id, format: "json", nojsoncallback : "1" }
    ).done(function(json) {
      gallery_ref.process_set(json);
    }).fail(function(json) {alert("Failed to load Photo Set");});
  },

  process_set : function(set) {
    this.setLength = set.photoset.photo.length;
    gallery_ref = this; //pretty sure there is a better way to do this....
    $.each(set.photoset.photo, function(i,photo){
      $.getJSON("http://api.flickr.com/services/rest/?",
        {method: "flickr.photos.getSizes", api_key: photoTools.flickr.api_key, photo_id: photo.id, format: "json", nojsoncallback : "1"  }
      ).done(function(sizeobject) {
        sizeHash = photoTools.getSizeHash(sizeobject.sizes.size);
        gallery_ref.add_to_gallery(sizeHash.Thumbnail, sizeHash.Original, photo.id);
      });
    });
  },

  add_to_gallery : function(thumb, full, photo_id) {
    link = $("<a/>").attr({href : full});
    thumb = $("<img/>").attr({src : thumb}).appendTo('#' + this.gallery_id);
    link.appendTo('#' + this.gallery_id);
    thumb.appendTo(link);
    this.log_rendered(photo_id);
  },

  log_rendered : function(photo_id) {
    this.rendered_count++;
    this.rendered_ids.push(photo_id); 
    if(this.rendered_count == this.setLength) {
      $('#' + this.gallery_id + ' a').touchTouch();
    }
  }
}

photoTools.getSizeHash = function(available) {
  var sizes = {};
  $.each(available, function(i, size) {
    sizes[size.label] = size.source;
  });
  return sizes;
};

/*
photoTools.flickr.loadSet = function(photoset_id, gallery_id) {
  $.getJSON("http://api.flickr.com/services/rest/?",
    {method: "flickr.photosets.getPhotos", api_key: photoTools.flickr.api_key, photoset_id: photoset_id, format: "json", nojsoncallback : "1" }
  ).done(function(json) {
    photoTools.flickr.processSet(json, gallery_id);
  }).fail(function(json) {alert("Failed to load Photo Set");});
};


photoTools.flickr.processSet = function(set, gallery_id) {
  phototools.galleries[gallery_id] = {};//maybe I should prototype this or something
  phototools.galleries[gallery_id].setlength = set.photoset.photo.length;
  phototools.galleries[gallery_id].rendered = 0;
  $.each(set.photoset.photo, function(i,photo){
    if(setlength - 1 == i) photoTools.flickr.lastPhotoId = photo.id;
    $.getJSON("http://api.flickr.com/services/rest/?",
      {method: "flickr.photos.getSizes", api_key: photoTools.flickr.api_key, photo_id: photo.id, format: "json", nojsoncallback : "1"  }
    ).done(function(sizeobject) {
      sizeHash = photoTools.getSizeHash(sizeobject.sizes.size);
      photoTools.add_to_gallery(sizeHash.Thumbnail, sizeHash.Original, gallery_id, photo.id);
    });
  });
};

photoTools.add_to_gallery = function(thumb, full, gallery_id, photo_id) {
  link = $("<a/>").attr({href : full});
  thumb = $("<img/>").attr({src : thumb}).appendTo('#' + gallery_id);
  link.appendTo('#' + gallery_id);
  thumb.appendTo(link);




  if((photoTools.flickr.lastPhotoId != undefined) && (photoTools.flickr.lastPhotoId == photo_id)) {
    alert("running!!!");
    $('#' + gallery_id + ' a').touchTouch();
  }
};
*/






/*
$.getJSON("http://api.flickr.com/services/rest/?",
  {method: "flickr.photosets.getPhotos", api_key: "e9c269dab327f845d9ab34045f9db905", photoset_id: "72157641723925504", format: "json", nojsoncallback : "1" },
  function(set_container) {
    $.each(set_container.photoset.photo, function(i,photo){
      $.getJSON("http://api.flickr.com/services/rest/?",
        {method: "flickr.photos.getSizes", api_key: "e9c269dab327f845d9ab34045f9db905", photo_id: photo.id, format: "json", nojsoncallback : "1"  },
        function(sizeobject) { 
          sizeHash = getSizeHash(sizeobject.sizes.size);
          link = $("<a/>").attr({href : sizeHash.Original});
          thumb = $("<img/>").attr({src : sizeHash.Thumbnail}).appendTo("#commercial_gallery");
          link.appendTo("#commercial_gallery");
          thumb.appendTo(link);

          //don't know if we should do this each time...might ensure that under a slow connection images are still viewable, but also might be slow...
          if ((photoTools.setLength -1) == photoTools.setPosition) {
          alert(photoTools.setLength + " --- " + photoTools.setPosition);
            $('#commercial_gallery a').touchTouch();
          }
        }
      );
    });
  }
);
//$(function() {
 // $('#commercial_gallery a').touchTouch();
//});

function getSizeHash(available) {
  sizes = new Object();
  $.each(available, function(i, size) {
    sizes[size.label] = size.source;
  });
  return sizes;
}

*/
