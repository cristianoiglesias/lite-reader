$(document).ready(function () {
    stage.init();
    loadr.init();
    $(document).click(hideAddFeed);
    $('#addfeed > *').click(showAddFeed);
    $('.update').click(function(){
      feeds.update(this.id);
      });
    $('#mark-read-all').click(function(){
      feeds.markread(this.id);
      });
    $('#mark-unread-all').click(function(){
      feeds.markunread(this.id);
      });
    $('.remove').click(function(){
      feeds.del(this.id);
      });
    feeds.init();

    if(feeds.container.find('>li').length < 2){
      $('#feeds-actions').hide();
    }
    $('#update-all').click(function(){
      feeds.update_all();
    });
    $(document).bind('keydown',function(e){
      var code = (e.keyCode ? e.keyCode : e.which);
      if(code == 32) {
        if(items.current !== null){
          var h = items.current.height();
          var top = items.current.offset().top;
          console.log(h+top);
          if(top+h<$('.ui-layout-center').height()){
            items.current.next().find('.title').click();
          }
        }
      }
    });
});

function addFeed(url){
  var aInput=$("#urlToAdd");
  var af=$('#addfeed .add');
  //var currImg='url(public/images/add.png)';
  //af.css('background-image','url(public/images/loading.gif)');
  af.find("span").text('Adding Feed...');
  af.find("i").removeClass("icon-plus");
  af.find("i").addClass("icon-spin icon-spinner");
  $.ajax({
      url:'agg/add',
      type:"POST",
      data:"url="+url,
      dataType:"json",
      success:function(data){
        af.find("span").text('Feed');
        if(!data.error){
          $.each(data, function(i,feed){
            feeds.add(feed);
          });
        }else{
            console.log(data.feed);
            feeds.blink(data.feed);
        }
        //af.css('background-image',currImg);
        af.find("i").removeClass("icon-spin icon-spinner");
        af.find("i").addClass("icon-plus");
        aInput.val("");
        hideAddFeed();
      }   
  });
}

function showAddFeed(e){
  e.stopPropagation();
  var aButton=$("#addfeed a");
  aButton.removeClass("btn-purple");
  aButton.addClass("btn-green");
  aButton.find("span").text("");
  var aInput=$("#urlToAdd");
  aInput.removeClass('ui-state-error');
  //aButton.parent().animate({width:"230px"},500,null,function(e){
      aInput.show();
      aButton.unbind('click');
      aButton.click(function(e){
        aButton.unbind('click');
        e.stopPropagation();
        if(aInput.val() === ""){
          hideAddFeed();
          return;
        }
        if(aInput.val().indexOf('http')<0){
          aInput.val("http://"+aInput.val());
        }
        var bValid = true;
        aInput.removeClass('ui-state-error');
        bValid = bValid && checkLength(aInput,"Url",10,255);
        bValid = bValid && checkRegexp(aInput,/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i,"Please Enter a Valid Url.");
        if(bValid){
          addFeed(aInput.val());
          aInput.val("");
          hideAddFeed();
        }
      });
  //});
}

function hideAddFeed(){
  var aButton=$("#addfeed a");
  var aInput=$("#urlToAdd");
  aButton.addClass("btn-purple");
  aButton.removeClass("btn-green");
  aButton.find("span").text("Feed");
  aInput.hide();
  $('#addfeed > *').click(showAddFeed);
  //aButton.parent().animate({width:"60px"},300,null,function(){
      //$('#addfeed > *').click(showAddFeed);
  //});
}





