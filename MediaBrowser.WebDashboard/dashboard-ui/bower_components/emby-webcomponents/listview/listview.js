define(["itemHelper","mediaInfo","indicators","connectionManager","layoutManager","globalize","datetime","userdataButtons","apphost","css!./listview"],function(itemHelper,mediaInfo,indicators,connectionManager,layoutManager,globalize,datetime,userdataButtons,appHost){"use strict";function getIndex(item,options){if("disc"===options.index)return null==item.ParentIndexNumber?"":globalize.translate("sharedcomponents#ValueDiscNumber",item.ParentIndexNumber);var code,name,sortBy=(options.sortBy||"").toLowerCase();return 0===sortBy.indexOf("sortname")?"Episode"===item.Type?"":(name=(item.SortName||item.Name||"?")[0].toUpperCase(),code=name.charCodeAt(0),code<65||code>90?"#":name.toUpperCase()):0===sortBy.indexOf("officialrating")?item.OfficialRating||globalize.translate("sharedcomponents#Unrated"):0===sortBy.indexOf("communityrating")?null==item.CommunityRating?globalize.translate("sharedcomponents#Unrated"):Math.floor(item.CommunityRating):0===sortBy.indexOf("criticrating")?null==item.CriticRating?globalize.translate("sharedcomponents#Unrated"):Math.floor(item.CriticRating):0===sortBy.indexOf("albumartist")&&item.AlbumArtist?(name=item.AlbumArtist[0].toUpperCase(),code=name.charCodeAt(0),code<65||code>90?"#":name.toUpperCase()):""}function getImageUrl(item,width){var apiClient=connectionManager.getApiClient(item.ServerId),options={width:width,type:"Primary"};return item.ImageTags&&item.ImageTags.Primary?(options.tag=item.ImageTags.Primary,apiClient.getScaledImageUrl(item.Id,options)):item.AlbumId&&item.AlbumPrimaryImageTag?(options.tag=item.AlbumPrimaryImageTag,apiClient.getScaledImageUrl(item.AlbumId,options)):item.SeriesId&&item.SeriesPrimaryImageTag?(options.tag=item.SeriesPrimaryImageTag,apiClient.getScaledImageUrl(item.SeriesId,options)):item.ParentPrimaryImageTag?(options.tag=item.ParentPrimaryImageTag,apiClient.getScaledImageUrl(item.ParentPrimaryImageItemId,options)):null}function getTextLinesHtml(textlines,isLargeStyle){for(var html="",i=0,length=textlines.length;i<length;i++){var text=textlines[i];text&&(html+=0===i?isLargeStyle?'<h2 class="listItemBodyText">':'<div class="listItemBodyText">':'<div class="secondary listItemBodyText">',html+=textlines[i]||"&nbsp;",html+=0===i&&isLargeStyle?"</h2>":"</div>")}return html}function getRightButtonsHtml(options){for(var html="",i=0,length=options.rightButtons.length;i<length;i++){var button=options.rightButtons[i];html+='<button is="paper-icon-button-light" class="listItemButton itemAction" data-action="custom" data-customaction="'+button.id+'" title="'+button.title+'"><i class="md-icon">'+button.icon+"</i></button>"}return html}function getListViewHtml(options){for(var items=options.items,groupTitle="",action=options.action||"link",isLargeStyle="large"===options.imageSize,enableOverview=options.enableOverview,clickEntireItem=!!layoutManager.tv,outerTagName=clickEntireItem?"button":"div",enableSideMediaInfo=null==options.enableSideMediaInfo||options.enableSideMediaInfo,outerHtml="",i=0,length=items.length;i<length;i++){var item=items[i],html="";if(options.showIndex){var itemGroupTitle=getIndex(item,options);itemGroupTitle!==groupTitle&&(html&&(html+="</div>"),html+=0===i?'<h1 class="listGroupHeader listGroupHeader-first">':'<h1 class="listGroupHeader">',html+=itemGroupTitle,html+="</h1>",html+="<div>",groupTitle=itemGroupTitle)}var cssClass="listItem";options.highlight!==!1&&(cssClass+=" listItem-shaded"),clickEntireItem&&(cssClass+=" itemAction listItem-button"),layoutManager.tv&&(cssClass+=" listItem-focusscale");var downloadWidth=80;isLargeStyle&&(cssClass+=" listItem-largeImage",downloadWidth=500);var playlistItemId=item.PlaylistItemId?' data-playlistitemid="'+item.PlaylistItemId+'"':"",positionTicksData=item.UserData&&item.UserData.PlaybackPositionTicks?' data-positionticks="'+item.UserData.PlaybackPositionTicks+'"':"",collectionIdData=options.collectionId?' data-collectionid="'+options.collectionId+'"':"",playlistIdData=options.playlistId?' data-playlistid="'+options.playlistId+'"':"",mediaTypeData=item.MediaType?' data-mediatype="'+item.MediaType+'"':"",collectionTypeData=item.CollectionType?' data-collectiontype="'+item.CollectionType+'"':"",channelIdData=item.ChannelId?' data-channelid="'+item.ChannelId+'"':"";if(html+="<"+outerTagName+' class="'+cssClass+'"'+playlistItemId+' data-action="'+action+'" data-isfolder="'+item.IsFolder+'" data-id="'+item.Id+'" data-serverid="'+item.ServerId+'" data-type="'+item.Type+'"'+mediaTypeData+collectionTypeData+channelIdData+positionTicksData+collectionIdData+playlistIdData+">",!clickEntireItem&&options.dragHandle&&(html+='<i class="listViewDragHandle md-icon listItemIcon listItemIcon-transparent">&#xE25D;</i>'),options.image!==!1){var imgUrl=getImageUrl(item,downloadWidth),imageClass=isLargeStyle?"listItemImage listItemImage-large":"listItemImage";clickEntireItem||(imageClass+=" itemAction"),html+=imgUrl?'<div data-action="link" class="'+imageClass+' lazy" data-src="'+imgUrl+'" item-icon>':'<div class="'+imageClass+'">';var indicatorsHtml="";indicatorsHtml+=indicators.getPlayedIndicatorHtml(item),indicatorsHtml&&(html+='<div class="indicators listItemIndicators">'+indicatorsHtml+"</div>");var progressHtml=indicators.getProgressBarHtml(item,{containerClass:"listItemProgressBar"});progressHtml&&(html+=progressHtml),html+="</div>"}var textlines=[];options.showProgramDateTime&&textlines.push(datetime.toLocaleString(datetime.parseISO8601Date(item.StartDate),{weekday:"long",month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})),options.showProgramTime&&textlines.push(datetime.getDisplayTime(datetime.parseISO8601Date(item.StartDate))),options.showChannel&&item.ChannelName&&textlines.push(item.ChannelName);var parentTitle=null;options.showParentTitle&&("Episode"===item.Type?parentTitle=item.SeriesName:(item.IsSeries||item.EpisodeTitle&&item.Name)&&(parentTitle=item.Name));var displayName=itemHelper.getDisplayName(item);options.showIndexNumber&&null!=item.IndexNumber&&(displayName=item.IndexNumber+". "+displayName),options.showParentTitle&&options.parentTitleWithTitle?(displayName&&(parentTitle&&(parentTitle+=" - "),parentTitle=(parentTitle||"")+displayName),textlines.push(parentTitle||"")):options.showParentTitle&&textlines.push(parentTitle||""),displayName&&!options.parentTitleWithTitle&&textlines.push(displayName),item.IsFolder?options.artist!==!1&&item.AlbumArtist&&"MusicAlbum"===item.Type&&textlines.push(item.AlbumArtist):options.artist===!1||options.artist!==!0&&(item.Artists||[])[0]===options.containerAlbumArtist||item.ArtistItems&&"MusicAlbum"!==item.Type&&textlines.push(item.ArtistItems.map(function(a){return a.Name}).join(", ")),"Game"===item.Type&&textlines.push(item.GameSystem),"TvChannel"===item.Type&&item.CurrentProgram&&textlines.push(itemHelper.getDisplayName(item.CurrentProgram)),cssClass="listItemBody",clickEntireItem||(cssClass+=" itemAction"),options.image===!1&&(cssClass+=" itemAction listItemBody-noleftpadding"),html+='<div class="'+cssClass+'">';var moreIcon="dots-horiz"===appHost.moreIcon?"&#xE5D3;":"&#xE5D4;";if(html+=getTextLinesHtml(textlines,isLargeStyle),options.mediaInfo!==!1&&!enableSideMediaInfo){var mediaInfoClass="secondary listItemMediaInfo listItemBodyText";html+='<div class="'+mediaInfoClass+'">'+mediaInfo.getPrimaryMediaInfoHtml(item,{episodeTitle:!1,originalAirDate:!1})+"</div>"}enableOverview&&item.Overview&&(html+='<div class="secondary overview listItemBodyText">',html+=item.Overview,html+="</div>"),html+="</div>",options.mediaInfo!==!1&&enableSideMediaInfo&&(html+='<div class="secondary listItemMediaInfo">'+mediaInfo.getPrimaryMediaInfoHtml(item,{year:!1,container:!1,episodeTitle:!1,criticRating:!1,endsAt:!1})+"</div>"),options.recordButton||"Timer"!==item.Type&&"Program"!==item.Type||(html+=indicators.getTimerIndicator(item).replace("indicatorIcon","indicatorIcon listItemAside")),clickEntireItem||(options.addToListButton&&(html+='<button is="paper-icon-button-light" class="listItemButton itemAction" data-action="addtoplaylist"><i class="md-icon">&#xE03B;</i></button>'),options.moreButton!==!1&&(html+='<button is="paper-icon-button-light" class="listItemButton itemAction" data-action="menu"><i class="md-icon">'+moreIcon+"</i></button>"),options.rightButtons&&(html+=getRightButtonsHtml(options)),options.enableUserDataButtons!==!1&&(html+='<span class="listViewUserDataButtons">',html+=userdataButtons.getIconsHtml({item:item,includePlayed:!1,cssClass:"listItemButton"}),html+="</span>")),html+="</"+outerTagName+">",outerHtml+=html}return outerHtml}return{getListViewHtml:getListViewHtml}});