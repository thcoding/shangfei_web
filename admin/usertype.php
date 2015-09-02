<?php
if($y==11){
?>
<div><b>管理员&nbsp;&nbsp;</b><a>|</a>&nbsp;&nbsp;<a href="?y=12">教员&nbsp;&nbsp;</a><a>|</a>&nbsp;&nbsp;<a href="?y=13">学员</a></div>
<div class="search">
<form action="" method="get">
				<?php
					$username = isset($_GET["username"])?$_GET["username"]:"";
					$realname = isset($_GET["realname"])?$_GET["realname"]:"";
					$by1 = $by2 = $by3 = "";
					$order = 1;
					if(isset($_GET["order"])){
						switch($_GET["order"]){
							case 1:
								$by1 = "selected";
								$order = 1;
								break;
							case 2:
								$by2 = "selected";
								$order = 2;
								break;
							case 3:
								$by3 = "selected";
								$order = 3;
								break;
						}
					}					
					
					?>
						<table>
						<tr>
							<td>用户名</td>
							<td><input name="username" value="<?php echo $username;?>"></td>
						</tr>
						<tr>
							<td>真实姓名</td>
							<td><input name="realname" value="<?php echo $realname;?>"></td>
						</tr>
						<tr>
							<td>排序方式</td>
							<td>
								<select id="sel_order" name="order">
								<option value="1" <?php echo $by1;?>>创建时间降序</option>
								<option value="2" <?php echo $by2;?>>创建时间升序</option>
								<option value="3" <?php echo $by3;?>>部门</option>
								</select>
							</td>
						</tr>
						<tr>
                        <input name="y" value="11" style="visibility: hidden;"/>
							<td colspan="2"><input id="btn_search" type="submit" value="提交"></td>
						</tr>
					</table>
				</form>
			</div>
			<div class="wrap">
			<?php
			include "../inc/class/page_user.php";
			$f = new page();

			$by = "order by time desc";

			$self = $_SERVER["PHP_SELF"];

			$linkPage = "$self";

			$f->fenye($page,$order,$linkPage,1,$username,$realname);
			?>
</div>
<?php
}else if($y==12){
?>
<div><a href="?y=11">管理员&nbsp;&nbsp;</a><a>|</a>&nbsp;&nbsp; <b>教员&nbsp;&nbsp;</b><a>|</a>&nbsp;&nbsp;<a href="?y=13">学员</a></div>
<div class="search">
<form action="" method="get">
	<?php
					$username = isset($_GET["username"])?$_GET["username"]:"";
					$realname = isset($_GET["realname"])?$_GET["realname"]:"";
					$by1 = $by2 = $by3 = "";
					$order = 1;
					if(isset($_GET["order"])){
						switch($_GET["order"]){
							case 1:
								$by1 = "selected";
								$order = 1;
								break;
							case 2:
								$by2 = "selected";
								$order = 2;
								break;
							case 3:
								$by3 = "selected";
								$order = 3;
								break;
						}
					}					
					
					?>
						<table>
						<tr>
							<td>用户名</td>
							<td><input name="username" value="<?php echo $username;?>"></td>
						</tr>
						<tr>
							<td>真实姓名</td>
							<td><input name="realname" value="<?php echo $realname;?>"></td>
						</tr>
						<tr>
							<td>排序方式</td>
							<td>
                                <select id="sel_order" name="order">
								<option value="1" <?php echo $by1;?>>创建时间降序</option>
								<option value="2" <?php echo $by2;?>>创建时间升序</option>
								<option value="3" <?php echo $by3;?>>部门</option>
								</select>
							</td>
						</tr>
						<tr>
                            <input name="y" value="12" style="visibility: hidden;"/>
							<td colspan="2"><input id="btn_search" type="submit" value="提交"></td>
						</tr>
					</table>
				</form>
			</div>
			<div class="wrap">
			<?php
			include "../inc/class/page_user.php";
			$f = new page();

			$by = "order by time desc";

			$self = $_SERVER["PHP_SELF"];

			$linkPage = "$self?y=$y";

			$f->fenye($page,$order,$linkPage,2,$username,$realname);
			?>
</div>
<?php
}else if($y==13){
?>
<div><a href="?y=11">管理员&nbsp;&nbsp;</a><a>|</a> &nbsp;&nbsp;<a href="?y=12">教员&nbsp;&nbsp;</a><a>|</a> &nbsp;&nbsp; <b>学员</b></div>
<div class="search">
<form action="" method="get">
<?php
					$username = isset($_GET["username"])?$_GET["username"]:"";
					$realname = isset($_GET["realname"])?$_GET["realname"]:"";
					$by1 = $by2 = $by3 = "";
					$order = 1;
					if(isset($_GET["order"])){
						switch($_GET["order"]){
							case 1:
								$by1 = "selected";
								$order = 1;
								break;
							case 2:
								$by2 = "selected";
								$order = 2;
								break;
							case 3:
								$by3 = "selected";
								$order = 3;
								break;
						}
					}					
					
					?>
						<table>
						<tr>
							<td>用户名</td>
							<td><input name="username" value="<?php echo $username;?>"></td>
						</tr>
						<tr>
							<td>真实姓名</td>
							<td><input name="realname" value="<?php echo $realname;?>"></td>
						</tr>
						<tr>
							<td>排序方式</td>
							<td>
                                <select id="sel_order" name="order">
								<option value="1" <?php echo $by1;?>>创建时间降序</option>
								<option value="2" <?php echo $by2;?>>创建时间升序</option>
								<option value="3" <?php echo $by3;?>>部门</option>
								</select>
							</td>
						</tr>
						<tr>
                            <input name="y" value="13" style="visibility: hidden;"/>
							<td colspan="2"><input id="btn_search" type="submit" value="提交"></td>
						</tr>
					</table>
				</form>
			</div>
			<div class="wrap">
			<?php
			include "../inc/class/page_user.php";
			$f = new page();

			$by = "order by time desc";

			$self = $_SERVER["PHP_SELF"];

			$linkPage = "$self?y=$y";

			$f->fenye($page,$order,$linkPage,3,$username,$realname);
			?>
</div>
<?php
}else{
?>
<div><a href="?y=11">管理员&nbsp;&nbsp; </a><a>|</a> &nbsp;&nbsp; <a href="?y=12">教员&nbsp;&nbsp;</a> <a>|</a>&nbsp;&nbsp; <a href="?y=13">学员</a></div>
<?php
}
?>