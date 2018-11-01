********
### React中路由传参及接收参数的方式

<html>
<h5 style='color:red'>注意：路由表改变后要重启服务</h5>
</html>


### 传参方式
    1. params : 只能传字符串
    2. query : 对象不会在路径上拼接
    3. state : 对象可传大量数据，自定义数据
<html>
    >
    <div id="cnblogs_post_body" class="blogpost-body"><strong>方式 一</strong>：</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; <span style="text-decoration: underline">&nbsp;通过params</span></div>
<div>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 1.路由表中 &nbsp; &nbsp; &nbsp;</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;Route&nbsp;path=' /sort/:id ' &nbsp;&nbsp;component={Sort}&gt;&lt;/Route&gt;</div>
<div>　　　　　　　　　　　</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 2.Link处 &nbsp; &nbsp; &nbsp; &nbsp;</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<span style="background-color: #888888; color: #ffff00">&nbsp;HTML方式</span></div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&lt;Link to={ ' /sort/ ' + ' 2 ' }&nbsp; activeClassName='active'&gt;XXXX&lt;/Link&gt;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;　　　　</div>
<div>　　　　　　　　　　　</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<span style="color: #ffff00; background-color: #888888">JS方式</span></div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.props.router.push(&nbsp; '/sort/'+'2'&nbsp; )</div>
<div>　　　　　　　　　　　</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 3.sort页面&nbsp; &nbsp; &nbsp; &nbsp;</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;通过&nbsp; this.props.params.id&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;<img alt="">就可以接受到传递过来的参数（id）</div>
<div>　　　　　　　　　　　</div>
<div>&nbsp; &nbsp;<strong>方式 二</strong>：</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<span style="text-decoration: underline">通过query</span></div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 前提：必须由其他页面跳过来，参数才会被传递过来</div>
<div>　　　&nbsp; &nbsp; &nbsp;注：不需要配置路由表。路由表中的内容照常：&lt;Route path='/sort' component={Sort}&gt;&lt;/Route&gt;</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 1.Link处&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<span style="background-color: #888888; color: #ffff00">&nbsp;HTML方式</span></div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;Link to={{ path : ' /sort ' , query : { name : 'sunny' }}}&gt;</div>
<div>　　　　　　　　　　</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp;<span style="background-color: #888888; color: #ffff00">JS方式</span></div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.props.router.push({ path : '/sort' ,query : { name: ' sunny'} })</div>
<div>&nbsp;</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 2.sort页面&nbsp; &nbsp; &nbsp;</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.props.location.query.name</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;<img alt=""></div>
<div>&nbsp; &nbsp; <strong>&nbsp;方式 三</strong>：</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; <span style="text-decoration: underline">通过state</span></div>
<div>&nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp; &nbsp; 同query差不多，只是属性不一样，而且state传的参数是加密的，query传的参数是公开的，在地址栏</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 1.Link 处&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;<span style="background-color: #888888; color: #ffff00"> HTML方式</span>：</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &lt;Link to={{ path : ' /sort ' , state : { name : 'sunny' }}}&gt;&nbsp;</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;<img alt="">　　</div>
<div><span style="background-color: #888888; color: #ffff00"><span style="background-color: #ffffff">&nbsp; &nbsp; &nbsp; &nbsp;</span> &nbsp;JS方式</span>：</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.props.router.push({ pathname:'/sort',state:{name : 'sunny' } })</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;　　 &nbsp;<img alt=""></div>
<div>&nbsp;&nbsp; &nbsp;&nbsp; &nbsp; 2.sort页面&nbsp;&nbsp; &nbsp;&nbsp; &nbsp;</div>
<div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; this.props.location.state.name</div>
<div>&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;　　 &nbsp;<img alt=""></div></div>
</html>
