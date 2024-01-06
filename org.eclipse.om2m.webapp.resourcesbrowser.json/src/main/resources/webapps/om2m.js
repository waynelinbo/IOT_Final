/*******************************************************************************
 * Copyright (c) 2013-2020 LAAS-CNRS (www.laas.fr)
 * 7 Colonel Roche 31077 Toulouse - France
 *
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License 2.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-2.0/
 *
 * Initial Contributors:
 *     Thierry Monteil : Project manager, technical co-manager
 *     Mahdi Ben Alaya : Technical co-manager
 *     Samir Medjiah : Technical co-manager
 *     Khalil Drira : Strategy expert
 *     Guillaume Garzone : Developer
 *     François Aïssaoui : Developer
 *
 * New contributors :
 *******************************************************************************/

/**
* Authors:
* Mahdi Ben Alaya <ben.alaya@laas.fr> <benalaya.mahdi@gmail.com>
* Marouane El kiasse <melkiasse@laas.fr> <kiasmarouane@gmail.com>
* Yassine Banouar <ybanouar@laas.fr> <yassine.banouar@gmail.com>
*/


var cseBase= getUrlVar("cseId");
var context=getUrlVar("context");
$(document).ready(function() {
  $("#main").hide();
  $("input#username").focus();
});

var username;
var password;
var parser=new DOMParser();

/**
* Append for blocked users
*/
const tryCountMax = 5;
var tryCount = 0;
var isBlocked = false;
//////////////////////////////////////////



function make_base_auth(user, password) {
  var tok = user + ':' + password;
  //var hash = btoa(tok);
  //return "Basic " + hash;
  return tok;
}

function login(){
    if (isBlocked) {
        $("#failCount").html('Fail login count >= '+tryCountMax);
        $("#error").html('You are banned !');
    }
    else {
        username = $("input#username").val();
        password = $("input#password").val();
        get("/" + cseBase);
    }
}

function logout(){
    username = "";
    password = "";
    $("input#username").val("")
    $("input#password").val("")
    $("#attributes").html("");
    $('#content').html("");
    $('#response').html("");
    $("#login").show();
    $("#main").hide();
}

function get(targetId){
    $.ajax({
        type: "GET",
        beforeSend: function(){},
        dataType: "json",
        url: context + targetId + "?rcn=5&lvl=1",
        headers : {"X-M2M-Origin" : make_base_auth(username, password), "Accept":"application/json"},
        success: function(response){
            $("#login").hide();
            $("#main").show();
            $("#url").text(window.location.protocol+"//"+window.location.host+context+targetId);
            $("#"+encodeId(targetId)).html("");
            $("#attributes").html("");
            $('#content').html('');
            $('#response').html('');
            $("#failCount").html('');
            $("#error").html('');

            tryCount = 0;

            for(var resourceName in response){
                var resource = response[resourceName];
                if(resourceName == "m2m:cb"){
                    $("#resources").html("<li onclick=get('"+targetId+"')>"+resource['rn']+"<ul id="+encodeId(targetId)+"></ul></li>");
                }
                for (var attribute in resource){
                    if(attribute == "ch"){
                        for (var index in resource[attribute]){
                            var child = resource[attribute][index];
                            $("#"+encodeId(targetId)).append("<li onclick=get('"+child["val"]+"')>"+child["nm"]+"<ul id="+encodeId(child["val"])+"></ul></li>");
                        }
                        
                    } else {
                        var value ;
                        if(attribute == "pv" || attribute == "pvs"){
                            var table = '<table class="bordered"><thead><th>AccessControlOriginator</th><th>AccessControlOperation</th></thead>' +
                                    '<tbody>' ;
                            for(var index in resource[attribute]['acr']){
                                var acr = resource[attribute]['acr'][index] ;
                                var acor = '<table class="bordered"><tbody>'
                                var acors = acr['acor'];
                                for (var indexJ in acors){
                                    acor += "<tr><td>"+ acors[indexJ] +"</td></tr>";
                                }
                                acor += "</tbody></table>" ;
                                table += '<tr><td>' + acor + '</td><td>'+ acr['acop'] +'</td></tr>'; 
                            }
                            table += '</tbody></table>' ;
                            value = table;
                        } else if (attribute == "poa"){
                            var table = '<table class="bordered"><thead><th>Point Of Access</th></thead><tbody>' ;
                            var poas = resource[attribute];
                            for (var index in poas){
                                table += '<tr><td>'+ poas[index] +'</td></tr>' 
                            }
                            table += "</tbody></table>";
                            value = table ;
                        } else if (attribute == "srt") {
                        	var table = '<table class="bordered"><thead><th>Supported resource types</th></thead><tbody>' ;
                            var srts = resource[attribute];
                            for (var index in srts){
                                table += '<tr><td>'+ srts[index] +'</td></tr>' 
                            }
                            table += "</tbody></table>";
                            value = table ;
                        } else if(resourceName == "m2m:csr" && attribute == "csi"){
                            value = '<button type="button" onClick="get(\'' + resource['csi'] +'\')">'+ resource['csi'] +'</button>';
                        } else if(attribute == "acpi"){
                            var table = "<table class='bordered'><thead><th>AccessControlPolicyIDs</th></thdead><tbody>";
                            var acpiList = resource[attribute];
                            for(var index in acpiList){
                                table += "<tr><td>" + acpiList[index] + "</td></tr>";
                            }
                            table += "</tbody></table>";
                            value = table;
                        }  else if(attribute == "daci"){
                            var table = "<table class='bordered'><thead><th>DynamicAuthorizationConsultationIDs</th></thdead><tbody>";
                            var daciList = resource[attribute];
                            for(var index in daciList){
                                table += "<tr><td>" + daciList[index] + "</td></tr>";
                            }
                            table += "</tbody></table>";
                            value = table;
                        }else if(attribute == "la" || attribute == "ol"){
                            value = "<button onClick=\"get('"+ resource[attribute] +"')\">"+ resource[attribute] +"</button>";
                        } else if ((attribute =="lbl") || (attribute == "nu")) {
	                        var lblList = resource[attribute];
	                        value="<ul>";
	                        for(var index in lblList) {
	                          value+= "<li>" + lblList[index] + "</li>";
	                        }
	                        value += "</ul>";
                        } else {
                            value = resource[attribute];
                            if (value instanceof Object) {
                              value = value.val;
                            }
                        }

                        if(attribute == "con"){
                            display(resource['con']);
                        } else {
                            $("#attributes").append("<tr><td class="+attribute+">"+attribute+"</td><td>"+value+"</td></tr>");                          
                        }
                    }
                }
            }
            $("li").click(function (e) {
                e.stopPropagation();
            });
        },
        error: function(xhr,status,error){
            tryCount += 1;
            if (tryCount == tryCountMax) isBlocked=true;
            if (isBlocked) {
                $("#failCount").html('Fail login count >= '+tryCountMax);
                $("#error").html('You are banned !');
            }
            else {
                $("#failCount").html('Fail login count : '+tryCount);
                $("#error").html(xhr.status+' '+status+' '+error);
            }
            
        }
    });
}

function encodeId(id){
    return id.replace(/[\n\s]/g,'').replace(/[\/]/gi,"_");
}

function clean(text){
    return text.replace(/[\n\s]/g,'');
}

function display(content){
    $("#attributes").append("<tr><td class="+"con"+">"+"con"+"</td><td id='cont'></td></tr>");


    //var obix= atob(content);
    var rep=parser.parseFromString(content,'text/xml');
    if(rep.firstChild.tagName != 'obj'){
      $('#cont').append(content);
      return;
    }

    $('#cont').append("<table class='bordered' id='contentTable'><thead><tr><th>Attribute</th><th>Value</th></tr></thead></table>");


    if(rep.firstChild.tagName!="obj"){
        $('#contentTable').append('<tr><td>'+$(rep.firstChild).attr('name')+'</td><td>'+$(rep.firstChild).attr('val')+'</td></tr>');
    }

    var childrens =$(rep.firstChild).children();

    for(var t=0; t<childrens.length; t++){
         if(childrens[t].tagName=="op"){
             if($(childrens[t]).attr('is')=="retrieve"){
                 $('#contentTable').append("<tr><td><input type='button' onclick=retrieve('"+$(childrens[t]).attr('href')+"') value='"+$(childrens[t]).attr('name')+"' ></td><td>"+$(childrens[t]).attr('href')+"</td></tr>");
             }else if ($(childrens[t]).attr('is')=="execute"){
                 $('#contentTable').append("<tr><td><input type='button' onclick=execute('"+$(childrens[t]).attr('href')+"') value='"+$(childrens[t]).attr('name')+"' ></td><td>"+$(childrens[t]).attr('href')+"</td></tr>");
             }else if ($(childrens[t]).attr('is')=="create"){
                 var objs = childrens;
                 for(var j=0; j<objs.length; j++){
                     if(objs[j].tagName=="obj"){
                         if($(objs[j]).attr('href')==$(childrens[t]).attr('in')){
                             var serializer = new XMLSerializer();
                             content = serializer.serializeToString( objs[j] );
                             $('#contentTable').append("<tr><td><input type='button' onclick=create('"+$(childrens[t]).attr('href')+"','"+btoa(content)+"') value='"+$(childrens[t]).attr('name')+"' ></td><td>"+$(childrens[t]).attr('href')+"</td></tr>");
                             break;
                         }
                     }
                 }
             }
         }
         else if(childrens[t].tagName!="obj"){
             $('#contentTable').append('<tr><td>'+$(childrens[t]).attr('name')+'</td><td>'+$(childrens[t]).attr('val')+'</td></tr>');
         }
    }
}

function getUrlVar(key){
  var result = new RegExp(key + "=([^&]*)", "i").exec(window.location.search);
  return result && unescape(result[1]) || "";
}

function execute(url){
  $('#response').html('');
  $.ajax({
    type: 'POST',
    url: context+url,
    headers: {"X-M2M-Origin":make_base_auth(username,password)},
    beforeSend: function() {
    },
    timeout: 20000,
    error: function(xhr, status, error) {
      if(xhr.status==204) successCallback(null, error, xhr);
      else  $('#response').append('<h4>Post request failed: '+xhr.status+' '+error+'</h4>'); },
    dataType: 'xml',
    success: function(response) {
      $('#response').append('<h4>Successful POST request.</h4>');
    }
  });
}

function retrieve(url){
  $('#response').html('');
  $.ajax({
    type: 'GET',
    url: context+url,
    headers: {"X-M2M-Origin":make_base_auth(username,password)},
    beforeSend: function() {
    },
    timeout: 20000,
    error: function(xhr, status, error) { $('#response').append('<h4>GET request failed: '+xhr.status+' '+error+'</h4>'); },     // alert a message in case of error
    dataType: 'xml',
    success: function(response) {

      $('#response').append('<h4>Successful GET Request:</h4>');
      $('#response').append('<table class="bordered" id="contentTable1" ><thead><tr><th >Name</th><th >Value</th></thead></table>');

      if(response.firstChild.localName=="obj"){
        $(response).find('obj').children().each(function() {
          $('#contentTable1').append('<tr"><td>'+$(this).attr('name')+'</td><td>'+$(this).attr('val')+'</td></tr>');
        });
      }else{
        $(response).children().each(function() {
            $('#contentTable1').append('<tr"><td>'+$(this).attr('name')+'</td><td>'+$(this).attr('val')+'</td></tr>');
          });
      }
    }
  });
}
  function create(url, content){
      $('#response').html('');
      $.ajax({
        type: 'POST',
        url: context+'/'+url,
        headers: {"X-M2M-Origin":make_base_auth(username,password)},
        beforeSend: function() {
        },
        timeout: 20000,
        data: atob(content),
        error: function(xhr, status, error) {
          if(xhr.status==204) successCallback(null, error, xhr);
          else  $('#response').append('<h4>Post request failed: '+xhr.status+' '+error+'</h4>');
          },
        dataType: 'xml',
        success: function(response) {
          $('#response').append('<h4>Successful POST request.</h4>');
        }
      });
}
