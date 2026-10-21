function everything(){
	
	categories = [ 'Всякие покупки', 'Аренда офиса', 'Ипотека', 'Коммунальные платежи', 'Интернет и офисные расходы','Обеды и всякая еда в офисе',  'Мобильная связь', 'Транспорт', 'Продукты и всякое домой', 'Одежда и обувь'];
	accounts = ['наличные','пластиковая карта','счёт в банке'];
	accountsCap = ['Наличные','Пластиковая карта','Счёт в банке'];
	monthsNames =['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
	monthsNamesIn =['в январе','в феврале','в марте','в апреле','в мае','в июне','в июле','в августе','в сентябре','в октябре','в ноябре','в декабре'];
	catColors = ['#89a333', '#537b24', '#00440f', '#ff592c', '#e60013', '#a1000a', '#2e034f', '#004486', '#006a68', '#00978d', '#e60013'];
	catColorsBright = ['#e7edd6', '#dde5d3', '#ccdacf', '#ffded5', '#faccd0', '#ecccce', '#d5cddc', '#ccdae7', '#cce1e1', '#cceae8', '#000000'];

	year = [];
	heightsInit = [];
	ordinatesInit = [];
	heightsResult = [];
	ordinatesResult = [];
		
	startMonth = 2;
	endMonth = 5;
	monthSums=[];
	
	soloCategory = '';
	accValue = '';
	catValue = '';
	dateValue = '';
	dragging = false;
	records = recordsByCategory;
	
//	graphX = -75;
	yLine = 304;
	barWidth = 80;

	catStates = []
	accStates = []
	categoriesCount = categories.length;
	accountsCount = accounts.length;
	for (c=0; c<categoriesCount; c++){
		catStates[c]=true;
		}
	for (a=0; a < accountsCount; a++){
		accStates[a]=true;
		}
	switchersState = [false, true, false];
	
//	plates=[];
	
	sortSwitchers();
	dataCreator();


	calculateCoords()
	createBars();
	timeSelect();
	animateBars()

	catList();
	accs();

//	graphicss();
	records();	
	
	$('#informer').append('Рекомендуем <a style="text-decoration: underline">внести в бюджет</a> наиболее стабильные категории. Это <span style="color:'+catColors[7]+'">транспорт</span>, <span style="color:'+catColors[1]+'">аренда офиса</span> и <span style="color:'+catColors[3]+'">коммунальные платежи</span>.')

	$('.closebtn').click(function(){
		trace('sss');
		$('#'+$(this).attr('obj')).hide();
	});
	$('.hint').animate({'border-color': "#ddd"},1000);


}

function createBars(){
	for (m=1; m<=12; m++){ //создаём дивы	
		for (c=0; c<categoriesCount; c++){
			if(catStates[c]){
				$('<div class="bar" id="bar'+m+''+c+'" style="cursor: pointer; left: '+(m*barWidth-5)+'px; top: '+(yLine+150)+'px; height: 0px;width: '+barWidth+'px; border-top: 1px solid '+(catColors[c])+'; background:'+catColorsBright[c]+'" c="'+c+'" m="'+m+'"></div>').appendTo('#graph');
			}
		}
	}
	$('<div class="bar" style="left: '+(75)+'px; top: '+(yLine+150)+'px; height: 1px; width: '+(barWidth*12)+'px; border-top: 1px solid #000"></div>').appendTo('#graph');

	$('#graph > .bar').mouseenter(function(){	
		var c = $(this).attr('c');
		var m = $(this).attr('m');

		$('#catdiv'+c).css('background', catColorsBright[c]);
		$('#graph > [class="bar"][c='+c+']').css('background-color', catColors[c]);

		if (soloCategory == ''){
			$('[class="bar"][m='+m+'] span').css('display', 'block');
			$('[class="bar"][m='+m+'][c='+c+'] span').css('color', 'white');			
			if (m>=startMonth && m<=endMonth){
			$('#months > [class="bar"][m='+m+'][z="z"] span').css('display', 'none');				
			}
		} else {
			$('#graph > [class="bar"][c='+c+'] span').css('display', 'block');
			$('#graph > [class="bar"][c='+c+'] span').css('color', 'white');			
					
		}
		$(this).mouseleave(function(){
			$('#catdiv'+c).css('background-color', '#fff');
			$('#graph > [class="bar"][c='+c+']').css('background-color', catColorsBright[c]);
			if (soloCategory == ''){
				$('[class="bar"][m='+m+'] span').css('display', 'none');
				$('[class="bar"][m='+m+'][c='+c+'] span').css('color', catColors[c]);			
			} else {
				$('[class="bar"][c='+c+'] span').css('color', catColors[c]);							
			}

		});
	});	
}

function calculateCoords(){
	yMax=0;
	months=[]; //считаем высоты, определяем максимальную
	for (m=1; m<=12; m++){
		months[m]=[];
		for (c=0; c<categoriesCount; c++){
		months[m][c]=0;
		monthSums[m]=0;
		}
		for (d=1; d<=30; d++){
			recordsCount = year[m][d].length;
			for (r=0; r<recordsCount;r++){
				if (accStates[year[m][d][r].account]){
					months[m][year[m][d][r].category]+=year[m][d][r].sum-0;
				} 
				
			}
		}
		monthCategoriesSum=0;
		for (c=0; c<categoriesCount; c++){
			if(catStates[c]){
				monthCategoriesSum+=months[m][c];
			}
		}
		monthSums[m]=monthCategoriesSum;
		yMax = Math.max(yMax, monthCategoriesSum);
	}
	var divisor=yMax/300
	for (m=1; m<=12; m++){ //считаем координаты	
		heightsResult[m]=[];
		ordinatesResult[m]=[];
		var currentY=304-Math.floor(monthSums[m]/divisor);
		for (c=0; c<categoriesCount; c++){
			if(catStates[c]){
				var barHeight=months[m][c]/divisor;
				heightsResult[m][c]=barHeight;
				ordinatesResult[m][c]=currentY
				currentY+=barHeight;
			} else {
				heightsResult[m][c]=0;
				ordinatesResult[m][c]=currentY
			}

		}
		
	}
	
	
	
}

function animateBars(){
	$('#graph > .bar').empty();
	$('#months > .bar').empty();
	for (m=1; m<=12; m++){ 	
		for (c=0; c<categoriesCount; c++){
				if (months[m][c]!=0 && heightsResult[m][c]>13){
					$('#graph > #bar'+m+''+c).append('<span style="color: '+catColors[c]+'; display:none">'+months[m][c]+' &#x20bd;</span>');
				}
				$('#graph >  #bar'+m+''+c).animate({
					height: heightsResult[m][c]+'px',
					top: ordinatesResult[m][c]+150+'px'
				}, 700);
		}
		$('#months > [class="bar"][z="z"][m='+m+']').append('<span style="display:none; border-top: 1px solid #aaa;">'+monthSums[m]+' &#x20bd;</span>')
	}	
}


function catList(){
	for (c=0; c<categoriesCount; c++){
		$('<div style="background-color: transparent; padding: 0px 5px 0px 2px; margin: 2px" id="catdiv'+c+'"><label class="catlabel" c="'+c+'"><input type="checkbox" class="cat" checked c="'+c+'"><span style="color:'+catColors[c]+'">'+categories[c]+'</span></input></label></div>').appendTo('#cats');
		catStates[c] = true;
	}
	$('#cats > div > label > .cat').click(function(){
		var c=$(this).attr('c');
		catStates[c]=this.value=="on"?true:false;
		calculateCoords();
		$('#graph > .bar').empty();
		records();
		animateBars();
		$('#graph > [class="bar"][c='+c+'] span').css('display', 'block');
		$('#graph > [class="bar"][c='+c+'] span').css('color', 'white');		
		soloCategory ='';
		sSumCalculate();
		$('#hint3').hide();

		});

	$('#cats > div > .catlabel').mouseenter(function(){
		
		var c = $(this).attr('c');
		$('#catdiv'+c).css('background', catColorsBright[c]);
		$('#graph > [class="bar"][c='+c+']').css('background-color', catColors[c]);
		$('#graph > [class="bar"][c='+c+'] span').css('display', 'block');
		$('#graph > [class="bar"][c='+c+'] span').css('color', 'white');

		$(this).mouseleave(function(){
			$('#catdiv'+c).css('background-color', 'transparent');
			$('#graph > [class="bar"][c='+c+']').css('background-color', catColorsBright[c]);
			if (soloCategory != $(this).attr('c')){
				$('#graph > [class="bar"][c='+c+'] span').css('display', 'none');
				$('#graph > [class="bar"][c='+c+'] span').css('color', catColors[c]);

			}
			

		});		
	});

	$('#graph > .bar').click(function(){
		var c = $(this).attr('c');
		var m = $(this).attr('m');
		if (soloCategory == c){
			for (cc=0; cc<categoriesCount; cc++){
				catStates[cc]=true;
				$('#cats > div > label > [class="cat"][c='+cc+']').attr("checked",true);			
				};
			soloCategory ='';
			calculateCoords();
			animateBars();
			$('#graph > [class="bar"][m='+m+'] span').css('display', 'block');
			$('#graph > [class="bar"][m='+m+'][c='+c+'] span').css('color', 'white');
			if (m>=startMonth && m<=endMonth){
				$('#graph > [class="bar"][m='+m+'][z="z"] span').css('display', 'none');				
			}

		} else {
			for (cc=0; cc<categoriesCount; cc++){
				catStates[cc]=false;
				$('#cats > div > label > [class="cat"][c='+cc+']').attr("checked",false);			
				};
			$('#cats > div > label > [class="cat"][c='+c+']').attr("checked",true);			
			soloCategory = c;
			catStates[c]=true;
			calculateCoords();
			animateBars();
			$('#graph > [class="bar"][c='+c+'] span').css('display', 'block');
			$('#graph > [class="bar"][c='+c+'] span').css('color', 'white');

		}
		sSumCalculate();

		records();		

	});	
};


function sSumCalculate(){
		var selectedsum = 0;
		for (m=startMonth; m<=endMonth; m++){
			selectedsum+=monthSums[m];
		}
		var color=soloCategory==''?'black':catColors[soloCategory];
		$('#ssum').empty();
		$('#ssum').css('left',((endMonth-1)*barWidth+10)+'px');
		$('#ssum').css('color',color);
		$('#ssum').append(selectedsum+' &#x20bd;');
}

function accs(){
	for (a=accountsCount-1; a>=0; a--){
		$('#accs').append('<div><label><input type="checkbox" class="acc" checked name="'+a+'">'+accountsCap[a]+'</input></label></div>');
		accStates[a] = true;
	}

	$('#accs > div > label > .acc').click(function(){
		accStates[this.name]=this.value=="on"?true:false;
		calculateCoords();
		animateBars();
		records();
		});

	
};

function timeSelect(){
	var selectedsum = 0;
	for (m=1; m<=12; m++){
		var bc = (m>=startMonth && m<=endMonth)?'background:#000; color: white':'background:transparent; color: black';
		$('<div class="plate" style="left: '+(m*barWidth-5)+'px; width:'+(barWidth-3)+'px;'+bc+'; cursor: pointer" m="'+m+'">'+monthsNames[m-1]+'</div>').appendTo('#months');
		$('<div class="bar" style="left: '+(m*barWidth-5)+'px; top:488px" z="z" m="'+m+'"></div>').appendTo('#months');
	}
	$('<div id="ssum"></div>').appendTo('#months');
	$('#ssum').css('left',((endMonth-1)*barWidth+10)+'px');
	for (m=startMonth; m<=endMonth; m++){
		selectedsum+=monthSums[m];
	}
	$('#ssum').append(selectedsum+' &#x20bd;');

	$('#months > .plate').mousedown(function(){
			var m=$(this).attr('m')-0;
			var t = $(this);
			dragging = true;
			startMonth = m;
			t.css('background','#000');
			t.css('color','#fff');
			$('#ssum').empty();
			$('#graph > [class="bar"][m='+m+'][z="z"] span').css('display', 'none');				
			$('#hint2').hide();
			clearPlates();
	});
	$('#months > .plate').mouseup(function(){
		dragging = false;
		endMonth = $(this).attr('m')-0;
		if (endMonth<startMonth){
			var a=startMonth;
			startMonth=endMonth;
			endMonth=a;
		}
		var selectedsum = 0;
		for (m=startMonth; m<=endMonth; m++){
			$('#months > [class="plate"][m='+m+']').css('background','#000');
			$('#months > [class="plate"][m='+m+']').css('color','#fff');
			selectedsum+=monthSums[m];
		}
		$('#ssum').css('left',((endMonth-1)*barWidth+10)+'px');
		$('#ssum').append(selectedsum+' &#x20bd;');
		
		records();

	});
		
	$('#months > .plate').mouseenter(function(){
			var t = $(this);
		if (dragging){
			t.css('background','#000');
			t.css('color','#fff');

		} else {
			if (t.attr('m') < startMonth || t.attr('m') > endMonth){
			t.css('background','#e5e5e0');
			}				
		}
		if (soloCategory == ''){
			var m = $(this).attr('m');
			$('#graph > [class="bar"][m='+m+'] span').css('display', 'block');
			if ((m>=startMonth && m<=endMonth) || dragging){
			$('#graph > [class="bar"][m='+m+'][z="z"] span').css('display', 'none');				
			}
		}
	});
	$('#months > .plate').mouseleave(function(){
		var t = $(this);
		var m = t.attr('m');
		if (dragging){
			endMonth = m;

		} else {
			if (m < startMonth || m > endMonth){
				t.css('background','transparent');
				t.css('color','black');				
			}
		}
		if (soloCategory == ''){
			$('#graph > [class="bar"][m='+m+'] span').css('display', 'none');
		}
	});	
	
}	

function clearPlates(){
	for (m=1; m<=12; m++){	
		if (m != startMonth){
			$('#months > [class="plate"][m='+m+']').css('background','transparent');
			$('#months > [class="plate"][m='+m+']').css('color','black');
		}
	}
}




	
function sortSwitchers(){
		$('#switchers').empty();
		$('#switchers').append('Сортировать ');

		
		if (switchersState[1]){
			$('<span class="selected">по категории,</span>').appendTo('#switchers')
		} else {
			$('<a href="javascript:">по категории</a><span>,  </span>').appendTo('#switchers').click(function(){
				records = recordsByCategory;
				switchersState = [false, true, false];
				sortSwitchers()
				records();
				$('#hint1').hide();

			});
		}
		
		if (switchersState[2]){
			$('<span class="selected">по счёту,</span>').appendTo('#switchers')
		} else {
			$('<span>  </span><a href="javascript:">по счёту</a><span>,  </span>').appendTo('#switchers').click(function(){
				records = recordsByAccount;
				switchersState = [false, false, true];
				sortSwitchers()
				records();
				$('#hint1').hide();
			});
		}
		if (switchersState[0]){
			$('<span class="selected">по дате</span>').appendTo('#switchers')
		} else {
			$('<span> </span><a href="javascript:">по дате</a><span><span>').appendTo('#switchers').click(function(){
				records = recordsByDate;
				switchersState = [true, false, false];
				sortSwitchers()
				records();
				$('#hint1').hide();				
			});
		}
}



function recordsByDate(){
	$('#table').empty();
	var totalSum = 0;
	for (m=endMonth; m>=startMonth; m--){
		var itemsCount = 0;
		var block = $('<div class="highlight" style="width:690px"id="hl'+m+'"><div>').appendTo('#table');
		block.append('<div class="tableheader" m="'+m+'" id="mnth'+m+'">'+monthsNames[m-1]+' 2011</div>');
		block.append('<table cellspacing="0" cellpadding="0" border="0" id="tab'+m+'">');
		block.append('<tr><td style="min-width:40px"></td><td style="min-width:150px"></td><td style="min-width:220px"></td><td style="min-width:180px"></td><td style="min-width:100px"></td></tr>');
			for (d=30; d>=1; d--){
				var recordsCount = year[m][d].length;
				for (r=0; r<recordsCount;r++){
					if (accStates[year[m][d][r].account] && catStates[year[m][d][r].category]){
						totalSum += year[m][d][r].sum-0;
						itemsCount++;
						if (accountsCap[year[m][d][r].account]==accValue){
							var accString = '';
							accValue = accountsCap[year[m][d][r].account];
						} else {
							var accString = accValue = accountsCap[year[m][d][r].account];
						}
						block.append('<tr class="row"><td class="rdate">'+d+'</td><td class="racc">'+accountsCap[year[m][d][r].account]+'</td><td class="rcat">'+categories[year[m][d][r].category]+'</td><td class="rcomm">'+year[m][d][r].comment+'</td><td class="rsum">'+year[m][d][r].sum+' &#x20bd;</td></tr>');
					}
				}
			}
			if (totalSum==0){
				$('#mnth'+m).empty();
				$('#tab'+m).empty();
			} else {
				if (itemsCount!=1){
					block.append('<tr><td colspan="4"></td><td class="tsum" m="'+m+'" ><span>'+totalSum+' &#x20bd;</span></td></tr>');
					block.append('</table>');
				} else {
					block.css('margin-bottom','10px');
				};
			}
			totalSum = 0;
	}
	$('#table > div > .row').mouseenter( function(){	
		$(this).css('background-color','#e5e5e0')
	})
	$('#table > div > .row').mouseleave(function(){	
		$(this).css('background-color','transparent')
	})
	$('#table > div > .tableheader').mouseenter(function(){	
		m = $(this).attr('m');
		$('#hl'+m).css('background-color','#e5e5e0');
	})	
	$('#table > div > .tableheader').mouseleave(function(){	
		m = $(this).attr('m');
		$('#hl'+m).css('background-color','transparent');
	})		
	$('.tsum').mouseenter(function(){	
		m = $(this).attr('m');
		$('#hl'+m).css('background-color','#e5e5e0');
	})	
	$('.tsum').mouseleave(function(){	
		m = $(this).attr('m');
		$('#hl'+m).css('background-color','transparent');
	})	
}

function recordsByCategory(){
	$('#table').empty();
	var totalSum = 0;
	for (c=0; c<categoriesCount; c++){
		var itemsCount = 0;

		if (catStates[c]){
			var block = $('<div class="highlight" style="width:690px"id="hl'+c+'"><div>').appendTo('#table');
			block.append('<div class="tableheader" c="'+c+'" id="cat'+c+'"><span style="color:'+catColors[c]+'">'+categories[c]+'</span></div>');
			block.append('<table cellspacing="0" cellpadding="0" border="0" id="tab'+c+'" >');
			block.append('<tr><td style="min-width:90px"></td><td style="min-width:180px"></td></td><td style="min-width:270px"></td><td style="min-width:150px"></td></tr>');
			for (m=endMonth; m>=startMonth; m--){
				for (d=30; d>=1; d--){
					var recordsCount = year[m][d].length;
					for (r=0; r<recordsCount;r++){
						if (accStates[year[m][d][r].account] && year[m][d][r].category==c){
							totalSum += year[m][d][r].sum-0;
							itemsCount++;
							block.append('<tr class="row"><td class="rdate">'+makeDate(d, m, '2011')+'</td><td class="racc">'+accountsCap[year[m][d][r].account]+'</td><td class="rcomm">'+year[m][d][r].comment+'</td><td class="rsum">'+year[m][d][r].sum+' &#x20bd;</td></tr>');
						}
					}
				}
			}
			if (totalSum==0){
				$('#cat'+c).empty();
			//	$('#tab'+c).empty();
			} else {
				if (itemsCount!=1){
					block.append('<tr><td colspan="3"></td><td class="tsum" c="'+c+'"><span>'+totalSum+' &#x20bd;</span></td></tr>')
					} else {
					block.css('margin-bottom','10px');
					};
			block.append('</table>');
			}
			totalSum = 0;
		}
	}
	$('#table > div > .row').mouseenter(function(){	
		$(this).css('background-color','#e5e5e0')
	})
	$('#table > div > .row').mouseleave(function(){	
		$(this).css('background-color','transparent')
	})
	$('#table > div > .tableheader').mouseenter(function(){	
		c = $(this).attr('c');
		$('#hl'+c).css('background-color','#e5e5e0');
	})	
	$('#table > div > .tableheader').mouseleave(function(){	
		c = $(this).attr('c');
		$('#hl'+c).css('background-color','transparent');
	})		
	$('.tsum').mouseenter(function(){	
		c = $(this).attr('c');
		$('#hl'+c).css('background-color','#e5e5e0');
	})	
	$('.tsum').mouseleave(function(){	
		c = $(this).attr('c');
		$('#hl'+c).css('background-color','transparent');
	})	
}

function recordsByAccount(){
	$('#table').empty();
	var totalSum = 0;
	for (a=accountsCount-1; a>=0; a--){
		var itemsCount = 0;

		if (accStates[a]){
			var block = $('<div class="highlight" style="width:690px"id="hl'+a+'"><div>').appendTo('#table');
			block.append('<div class="tableheader" a="'+a+'" id="acc'+a+'">'+accountsCap[a]+'</div>');
			block.append('<table cellspacing="0" cellpadding="0" border="0" id="tab'+a+'">');
			block.append('<tr><td style="min-width:90px"></td></td><td style="min-width:230px"></td><td style="min-width:270px"></td><td style="min-width:100px"></td></tr>');
			for (m=endMonth; m>=startMonth; m--){
				for (d=30; d>=1; d--){
					var recordsCount = year[m][d].length;
					for (r=0; r<recordsCount;r++){
						if (catStates[year[m][d][r].category] && year[m][d][r].account==a){
							totalSum += year[m][d][r].sum-0;
							itemsCount++;
							block.append('<tr class="row"><td class="rdate">'+makeDate(d, m, '2011')+'</td><td class="rcat">'+categories[year[m][d][r].category]+'</td><td class="rcomm">'+year[m][d][r].comment+'</td><td class="rsum">'+year[m][d][r].sum+' &#x20bd;</td></tr>');
						}
					}
				}
			}
			if (totalSum==0){
				$('#acc'+a).empty();
				$('#tab'+a).empty();
			} else {
				if(itemsCount!=1){
			block.append('<tr><td colspan="3"></td><td a="'+a+'" class="tsum"><span>'+totalSum+' &#x20bd;</span></td></tr>');
			block.append('</table>');
				} else {
					block.css('margin-bottom','10px');
				}
			}
			totalSum = 0;
		}
	}
	$('#table > div > .row').mouseenter(function(){	
		$(this).css('background-color','#e5e5e0')
	})
	$('#table > div > .row').mouseleave(function(){	
		$(this).css('background-color','transparent')
	})
	$('#table > div > .tableheader').mouseenter(function(){	
		a = $(this).attr('a');
		$('#hl'+a).css('background-color','#e5e5e0');
	})	
	$('#table > div > .tableheader').mouseleave(function(){	
		a = $(this).attr('a');
		$('#hl'+a).css('background-color','transparent');
	})		
	$('.tsum').mouseenter(function(){	
		a = $(this).attr('a');
		$('#hl'+a).css('background-color','#e5e5e0');
	})	
	$('.tsum').mouseleave(function(){	
		a = $(this).attr('a');
		$('#hl'+a).css('background-color','transparent');
	})	
}












function dataCreator(){

	officeComments = ['Бумага', 'Канцтовары', 'Тонер', 'Всякая химия', 'Мобильный интернет', '', '', '', '', '', '', '', '', '', '', '', '']
	thingsToBuy = [['iPad','27990'],['iPhone','40900'],['iPod','10450'],['Gibson Les Paul','30000'],['Beautiful Evedence','2600'],['Envisioning Information.','2700'],['Wilson Khamsin Five 108 BLX','11390'],['Merida Matts 20-MD','16570'],['Входная дверь','15800'],['Зашёл в книжный магазин','7400'],['Старенький МакбукПро','23000'],['Телефон','5700'],[' ','11200'],[' ','12800'],[' ','16900'],[' ','8200'],[' ','3500'],[' ','4100'],[' ','9200'],[' ','15450'],[' ','10900'],[' ','11200'],[' ','12200'],[' ','16300'],[' ','4200'],[' ','6600'],[' ','3100'],[' ','9200'],[' ','15450'],[' ','10900']];
	clothes = ['Майка','Рубашка','Куртка','Свитер','Джинсы','Кроссовки','Туфли','Брюки','Пиджак','Сандалии','Кеды','Шапка','Кепка','','','','','']
	
	for (m=1; m<=12; m++){
		year[m]=[];
		for (d=1; d<=30; d++){
		year[m][d]=[];
		var randomFactor= Math.floor(Math.random()*1000);
			for (c=0; c<categoriesCount; c++){
				if(categories[c]=='Аренда офиса' && d==5){
					year[m][d].push({account:2, category:c, sum:18000+Math.floor(Math.random()*6)*500, comment:''})
				}

				if(categories[c]=='Интернет и офисные расходы' && d==29){
					year[m][d].push({account:1, category:c, sum:5000, comment:'Абонентская за анлим'})
				}
				if(categories[c]=='Интернет и офисные расходы' && randomFactor<50){
					year[m][d].push({account:Math.floor(Math.random()*2.99), category:c, sum:100+Math.floor(Math.random()*9)*100, comment:officeComments[Math.floor(Math.random()*10)]})

				}

				if(categories[c]=='Обеды и всякая еда в офисе'){
					year[m][d].push({account:0, category:c, sum:200+Math.floor(Math.random()*8-3)*20, comment:''})
				}
				
				if(categories[c]=='Мобильная связь' && randomFactor>30 && randomFactor<330){
					year[m][d].push({account:0, category:c, sum:100, comment:''})
				}				
				if(categories[c]=='Транспорт' && randomFactor>300 && randomFactor<400){
					year[m][d].push({account:0, category:c, sum:150+Math.floor(Math.random()*3)*50, comment:'Такси'})
				}

				if(categories[c]=='Транспорт'){
					year[m][d].push({account:0, category:c, sum:28+Math.floor(Math.random()*3)*14, comment:''})
				}


				if(categories[c]=='Продукты и всякое домой' && d/7==Math.floor(d/7)){
					year[m][d].push({account:0, category:c, sum:1500, comment:'Гипермаркет'})
				}

				if(categories[c]=='Продукты и всякое домой' && randomFactor>40 && randomFactor<700){
					year[m][d].push({account:0, category:c, sum:100+Math.floor(Math.random()*6-2)*10, comment:''})
				}

				if(categories[c]=='Одежда и обувь' && randomFactor>940){
					commrnd = Math.floor(Math.random()*clothes.length);
					year[m][d].push({account:Math.floor(Math.random()*1.99), category:c, sum:1000+Math.floor(Math.random()*70)*100, comment:clothes[commrnd]})
				}
				
				if(categories[c]=='Ипотека' && d==30){
					year[m][d].push({account:1, category:c, sum:15000, comment:'Ежемесячный платёж'})
				}
				if(categories[c]=='Ипотека' && d==30){
					year[m][d].push({account:1, category:c, sum:100+Math.floor(Math.random()*6)*200, comment:'Пеня и комиссия'})
				}
								
				if(categories[c]=='Коммунальные платежи' && d==10){
					year[m][d].push({account:0, category:c, sum:5500+Math.floor(Math.random()*6)*200, comment:'Квартира, свет, вода, газ'})
				}
				
				if(categories[c]=='Всякие покупки' && randomFactor>650 && randomFactor<690){
					var rnd=Math.floor(Math.random()*thingsToBuy.length);
					var arr = thingsToBuy.splice(rnd,1);
					year[m][d].push({account:Math.floor(Math.random()*2.99), category:c, sum:arr[0][1], comment:arr[0][0]}) // здесь что-то не так
				}					
				
			}
		
		}
		
	}
		
};


function makeDate(d, m, year) {
	var day = d+'';
	if (day.length == 1){day="0"+day}
	var month = m+'';
	if (month.length == 1){month="0"+month}
		
	return day+'.'+month+'.'+year;
}


// трейсер

function trace(message){
	$('#msg').append('<div class="msg">'+message+'</div>');
}