var globalId;
$(function(){
	$(".list_courseUnit > ul > li").mouseover(function(){
		$(this).css("background-color","#efefef");
	}).mouseout(function(){
		$(this).css("background-color","");
	})
	$(".wrap tr").mouseover(function(){
		$(this).css("background-color","#efefef");
	}).mouseout(function(){
		$(this).css("background-color","");
	})
	$("a[href*=delete]").click(function(){
		return confirm("确实要删除吗？");
	})
	$("a[href*=revertTodo]").click(function(){
		return confirm("确实要恢复吗？");
	})
	
	$("#groupList img").click(function(){
		var obj = $(this);
		if($(this).attr("src")=="../img/expanded.gif"){
			$(this).attr("src","../img/no-expanded.gif").attr("alt","点击展开").attr("title","点击展开");
			$(this).parent("li").children("ul").hide();
		}else{
			$(this).attr("src","../img/expanded.gif").attr("alt","点击关闭").attr("title","点击关闭");
			if($(this).parent("li").children("ul").length==0){				
				$.ajax({				
					type: "GET",
					url: "getChildNode.php",
					data:"type="+$(this).attr("type")+"&id="+$(this).attr("id"),
					success:function(msg){
						obj.parent("li").append(msg);
						if(obj.parent("li").children("input").is(":checked")){
							obj.parent("li").children("ul").children("li").children("label").children("input").attr("checked",true);
						}
					}
				});
			}
			$(this).parent("li").children("ul").show();
		}
	})
	$("#groupList ul li input").click(function(){
		//alert("fd");
		if($(this).is(":checked")){
			//alert("1");
			$(this).parent("li").children("ul").children("li").children("label").children("input").attr("checked",true);
		}else{
			//alert("0");
			$(this).parent("li").children("ul").children("li").children("label").children("input").attr("checked",false);
		}
	})
	$("input[name='rewrite']").click(function(){
		if($(this).attr("value")==1){
			$("#newVersion").hide();
		}else{
			$("#newVersion").show().focus();
		}		
	})
})

function checkZip(){	
	var re = /(\\+)/g;
	var filepath = $("#file").val();
	var filename=filepath.replace(re,"#"); 
	//对路径字符串进行剪切截取
	var one=filename.split("#"); 
	//获取数组中最后一个，即文件名
	var two=one[one.length-1]; 
	//再对文件名进行截取，以取得后缀名
	var three=two.split("."); 
	 //获取截取的最后一个字符串，即为后缀名
	var last=three[three.length-1];
	//添加需要判断的后缀名类型
	var tp ="zip"; 
	//返回符合条件的后缀名在字符串中的位置
	var rs=tp.indexOf(last.toLowerCase()); 
	//如果返回的结果大于或等于0，说明包含允许上传的文件类型
	if(rs>=0){
		$("#isUnzip").show();
	}else{
		$("#isUnzip").hide();
	}
}

function checkFile(){
	var filepath = $("#file").val();
	if(filepath==""){
		alert("请选择文件");
		return false;
	}
    if ($("select[name='packageType']").val()==2 && filepath.substring(filepath.length - 4) != ".zip") {
        alert("只能上传zip格式的scorm课程包。");
        return false;
    }
	if($("input[name='rewrite']:checked").val()==0 && $("#versionname").val()==""){
		alert("请输入版本名称");
		$("#versionname").focus();
		return false;
	}
	var buttonObject=document.getElementById('uploadBtn');
	buttonObject.innerHTML='上传中...';
　　buttonObject.disabled=true;
	return true;
}

function setIndexFile(dir,id){
	$(".div_Mask").show();
	$(".div_wait").show();
	globalId = id;
	$.ajax({				
		type: "GET",
		url: "getDirList.php",
		data:"dir="+dir+"&id="+id,
		success:function(msg){
			$("#indexfile").html(msg);
			//setOnClickListener();
		}
	});
}
/*function setOnClickListener(){
	$("#indexfile img").click(function(){
		var obj = $(this);
		if($(this).attr("src")=="../img/expanded.gif"){
			$(this).attr("src","../img/no-expanded.gif").attr("alt","点击展开").attr("title","点击展开");
			$(this).parent("li").children("ul").hide();
		}else{
			$(this).attr("src","../img/expanded.gif").attr("alt","点击关闭").attr("title","点击关闭");
			//alert($(this).attr("dir"));
			if($(this).parent("li").children("ul").length==0){				
				$.ajax({				
					type: "GET",
					url: "getDirList.php",
					data:"dir="+$(this).attr("dir"),
					success:function(msg){
						obj.parent("li").append(msg);
						setOnClickListener();
					}
				});
			}else{
				$(this).parent("li").children("ul").show();
			}
		}
	})
}*/

function showChildrenDir(dir,obj){
	//alert(dir);
	var jq_obj = $(obj);
	if(jq_obj.attr("src")=="../img/expanded.gif"){
		jq_obj.attr("src","../img/no-expanded.gif").attr("alt","点击展开").attr("title","点击展开");
		jq_obj.parent("li").children("ul").hide();
	}else{
		jq_obj.attr("src","../img/expanded.gif").attr("alt","点击关闭").attr("title","点击关闭");
		//alert(jq_obj.attr("dir"));
		if(jq_obj.parent("li").children("ul").length==0){				
			$.ajax({				
				type: "GET",
				url: "getDirList.php",
				data:"dir="+jq_obj.attr("dir"),
				success:function(msg){
					jq_obj.parent("li").append(msg);
					//setOnClickListener();
				}
			});
		}else{
			jq_obj.parent("li").children("ul").show();
		}
	}
}