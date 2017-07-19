import { Component, OnInit } from '@angular/core';
import { Router ,ActivatedRoute} from '@angular/router';
import { Assetdetails } from "../../../interfaces/assetsInterface";
import { ConfigDetails } from "../../../interfaces/configinterface";
import { PersonalDetailsObject } from "../../../interfaces/personalDetails.interface";
import { OAOService } from "../../../services/OAO.Service";
import { CommonUtils } from '../../../validators/commonUtils';
import { AlphanumericValidator } from "../../../validators/alphanumeric_validator";

declare var jQuery: any;
@Component({
   
    templateUrl: 'expensegraph.component.html'
})
export class ExpenseComponent implements OnInit {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    Assets: Assetdetails;
    liability_tab: boolean = false;
    options: any = {legend: { display: false, position: 'left', fullWidth:false },
                    cutoutPercentage: 70
     }

    public chartColors: any[] = [
      { 
        backgroundColor:["#109618", "#ff9900", "#990099"] 
         
      }
      ];
     
       public barChartLabels: string[];
  public barChartData: any[];
  public barChartType: string;
  public isHML:boolean = true;
  public chart_Flag:boolean= false;
    public MaxLimit: Number;
    public assetsLength: Number;
    public LiabilitiesLength: Number;
    public assetsDetails: any;
    public LiabilitiesArray: any;
    public isAdmin: boolean;
    public assetType: any[] = [];
    public liabilityType: any[] = [];
    public freqType: any[] = [];
    public verification_auto: boolean;
    public application_id: any;
   public total_expense_show:any;
   public total_remaining_show:any;
   public total_emi_show:any;
  nextflag:boolean=true;
    public idCheck_v: String;
    public inf_loan: string;
    finalSend: PersonalDetailsObject;
    isLoading:Boolean=false;
    userExistingFlag:boolean=false; //chandan 
    private forwardProgressDataHML = ['completed','completed','completed','active','Y','N'];
   // private backwardProgressDataHML = ['completed','completed','active','N','N'];

    private forwardProgressDataPRL = ['completed','completed','completed','active','Y','N'];
    //private backwardProgressDataPRL = ['completed','completed','active','N','N'];

    constructor(private oaoService: OAOService, private router: Router,private route:ActivatedRoute) {
        console.log("ExpenseGraph constructor()")
        this.barChartType = 'doughnut';
        this.chart_Flag=true;
    //this.barChartLabels = ["Existing expenses/debts","New Loan Repayments","Total Remaining Amount"];
    //this.chart_proFlag = true;
   // this.barChartData = [0,0,0];
   // this.barChartLegend = false;
        this.model=this.oaoService.getPersonalDetailsObject();
        this.isAdmin = this.model.is_admin;
        console.log("in expense graph",this.model);
        console.log("EMI");
        console.log(this.model.emi,this.model.frequencyType);
        var emi_frequency= this.model.frequencyType;
        var emi = this.model.emi;
        if(emi_frequency!= undefined && emi_frequency=="month")
        {
            emi = emi;
        }
        else
        {
            if(emi_frequency!= undefined && emi_frequency=="week")
            {
                emi = emi*4;
            }
            else if(emi_frequency!= undefined && emi_frequency=="fortnight")
            {
                emi = emi*2;
            }
            else  {
                emi = emi;
            }
        }
        console.log("all expense");
        console.log(this.model.monthlyLivingExpenses,this.model.expenseFrequency,this.model.rentShare,this.model.frequencyOfRent,this.model.Liabilities);
        console.log("all earning");
        console.log(this.model.earnPerMonth,this.model.incomeFrequency,this.model.secondJobEarning,this.model.secondJobIncomeFrequency);
        var total_earning=0;
       var earningFrequency = this.model.incomeFrequency;
       var second_earning_frequency = this.model.secondJobIncomeFrequency;
       var earn_per_month = parseInt(this.model.earnPerMonth);
       console.log("earning per ",earn_per_month);
       var second_earn_per_month = parseInt(this.model.secondJobEarning);
       console.log("second_earn_per_month per ",second_earn_per_month);
       var otherincome = this.model.otherIncomeData;
      
      if(otherincome != undefined && otherincome.length >=1)
       {
           for(var j =0;j<otherincome.length;j++)
                   {
                       if(otherincome[j].otherIncomeFrequency == "month")
                       {
                           
                           total_earning=total_earning+parseInt(otherincome[j].otherIncomeEarning);
                           console.log("in otherincome if",total_earning);
                       }
                       else if(otherincome[j].otherIncomeFrequency == "week")
                       {
                           
                           total_earning=total_earning+parseInt(otherincome[j].otherIncomeEarning)*4;
                           console.log("in otherincome if2",total_earning);
                       }
                       else if(otherincome[j].otherIncomeFrequency == "fortnight")
                       {
                           
                           total_earning=total_earning+parseInt(otherincome[j].otherIncomeEarning)*2;
                           console.log("in otherincome if3",total_earning);
                       }
                       else
                       {
                           
                           total_earning=total_earning;
                           console.log("in otherincome esle",total_earning);
                       }
                       
                   }
       }
       if(earningFrequency!= undefined && earningFrequency=="month")
       {
           console.log("IN FIRST IF");
           total_earning = total_earning+earn_per_month;
           if(second_earning_frequency!=undefined && second_earning_frequency=="month")
           {
               total_earning = total_earning+second_earn_per_month;
           }
           else if(second_earning_frequency!=undefined && second_earning_frequency=="fortnight")
           {
               total_earning = total_earning+second_earn_per_month*2;
           }
           else if(second_earning_frequency!=undefined && second_earning_frequency=="week")
           {
               total_earning = total_earning+second_earn_per_month*4;
           }
           else 
           {
               total_earning=total_earning;
           }
           console.log("IN FIRST IF",total_earning);
       }
       else if(earningFrequency!= undefined && earningFrequency=="week")
       {
           
           total_earning = total_earning+earn_per_month*4;
           if(second_earning_frequency!=undefined && second_earning_frequency=="month")
           {
               total_earning = total_earning+second_earn_per_month;
           }
           else if(second_earning_frequency!=undefined && second_earning_frequency=="fortnight")
           {
               total_earning = total_earning+second_earn_per_month*2;
           }
           else if(second_earning_frequency!=undefined && second_earning_frequency=="week")
           {
               total_earning = total_earning+second_earn_per_month*4;
           }
           else 
           {
               total_earning=total_earning;
           }
           console.log("IN SECOND IF",total_earning);
       }
       else if(earningFrequency!= undefined && earningFrequency=="fortnight")
       {
           
           total_earning = total_earning+earn_per_month*2;
           if(second_earning_frequency!=undefined && second_earning_frequency=="month")
           {
               total_earning = total_earning+second_earn_per_month;
           }
           else if(second_earning_frequency!=undefined && second_earning_frequency=="fortnight")
           {
               total_earning = total_earning+second_earn_per_month*2;
           }
           else if(second_earning_frequency!=undefined && second_earning_frequency=="week")
           {
               total_earning = total_earning+second_earn_per_month/12;
           }
           else 
           {
               total_earning=total_earning;
           }
           console.log("IN THIRD IF",total_earning);
       }
       else{
           
           total_earning = 0;
           if(second_earning_frequency!=undefined && second_earning_frequency=="month")
           {
               total_earning = total_earning+second_earn_per_month;
           }
           else if(second_earning_frequency!=undefined && second_earning_frequency=="fortnight")
           {
               total_earning = total_earning+second_earn_per_month*2;
           }
           else if(second_earning_frequency!=undefined && second_earning_frequency=="week")
           {
               total_earning = total_earning+second_earn_per_month/12;
           }
           else 
           {
               total_earning=total_earning;
           }
           console.log("IN else",total_earning);
       }
       var total_expense = 0;
       var monthlyLivingExpenses = parseInt(this.model.monthlyLivingExpenses);
       console.log("monthlyLivingExpenses is",monthlyLivingExpenses);
       var monthlyLivingExpenses_frequency = this.model.expenseFrequency;
       var rentShare = parseInt(this.model.rentShare);
       console.log("rentshare is",rentShare);
       var rentShare_frequency = this.model.frequencyOfRent;
       var liabilities = this.model.Liabilities;
       if(monthlyLivingExpenses_frequency!=undefined && monthlyLivingExpenses_frequency =="month")
       {
           console.log("in monthlyexpense if");
           total_expense=total_expense+monthlyLivingExpenses;
           console.log("in monthlyexpense if",total_expense);
       }
       else
       {
           if(monthlyLivingExpenses_frequency!=undefined && monthlyLivingExpenses_frequency =="week")
           {
              
               total_expense=total_expense+monthlyLivingExpenses*4;
                console.log("in monthlyexpense if2",total_expense);
           }
           else if(monthlyLivingExpenses_frequency!=undefined && monthlyLivingExpenses_frequency =="fortnight"){
              
               total_expense=total_expense+monthlyLivingExpenses*2;
                console.log("in monthlyexpense if3",total_expense);
           }
           else{
               

               total_expense=total_expense;
               console.log("in monthlyexpense if4",total_expense);
           }
       }
       if(rentShare_frequency!= undefined && rentShare_frequency=="month")
       {
           
           total_expense = total_expense+rentShare;
           console.log("in renshare if",total_expense);
       }
       else{
            if(rentShare_frequency!= undefined && rentShare_frequency=="week")
            {
                
                total_expense = total_expense+rentShare*4;
                console.log("in renshare if2",total_expense);
            }
            else if(rentShare_frequency!= undefined && rentShare_frequency=="fortnight")
            {
                
                total_expense = total_expense+rentShare*2;
                console.log("in renshare if3",total_expense);
            }
            else if(rentShare_frequency!= undefined && rentShare_frequency=="annual")
            {
               
                total_expense = total_expense+rentShare/12;
                 console.log("in renshare if4",total_expense);
            }
            else 
            {
                
                total_expense = total_expense;
                console.log("in renshare if5",total_expense);
            }
       }
       if(liabilities != undefined && liabilities.length >=1)
       {
           for(var j =0;j<liabilities.length;j++)
                   {
                       if(liabilities[j].Payment_Frequency == "month")
                       {
                           
                           total_expense=total_expense+parseInt(liabilities[j].Payable_Amount);
                           console.log("in liabilities if",total_expense);
                       }
                       else if(liabilities[j].Payment_Frequency == "week")
                       {
                           console.log("in liabilities if2");
                           total_expense=total_expense+parseInt(liabilities[j].Payable_Amount)*4;
                           console.log("in liabilities if",total_expense);
                       }
                       else if(liabilities[j].Payment_Frequency == "fortnight")
                       {
                           console.log("in liabilities if3");
                           total_expense=total_expense+parseInt(liabilities[j].Payable_Amount)*2;
                           console.log("in liabilities if",total_expense);
                       }
                       else{
                           console.log("in liabilities if4");
                           total_expense=total_expense;
                           console.log("in liabilities if",total_expense);
                       }
                   }
       }
      /* if(monthlyLivingExpenses_frequency != undefined && monthlyLivingExpenses_frequency =="month")
       {
           total_expense = total_expense+monthlyLivingExpenses;
           if(rentShare_frequency != undefined && rentShare_frequency == "month")
           {
               total_expense = total_expense+rentShare;
               if(liabilities !=undefined && liabilities.length >=1)
               {
                   for(var j =0;j<liabilities.length;j++)
                   {
                       if(liabilities[j].Payment_Frequency == "month")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount;
                       }
                       else if(liabilities[j].Payment_Frequency == "week")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount*4;
                       }
                       else if(liabilities[j].Payment_Frequency == "fortnight")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount*2;
                       }
                       else{
                           total_expense=total_expense;
                       }
                   }
               }
               
           }
           else if(rentShare_frequency != undefined && rentShare_frequency == "week")
           {
                total_expense = total_expense+rentShare*4;
                 if(liabilities !=undefined && liabilities.length >=1)
               {
                   for(var j =0;j<liabilities.length;j++)
                   {
                       if(liabilities[j].Payment_Frequency == "month")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount;
                       }
                       else if(liabilities[j].Payment_Frequency == "week")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount*4;
                       }
                       else if(liabilities[j].Payment_Frequency == "fortnight")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount*2;
                       }
                       else{
                           total_expense=total_expense;
                       }
                   }
               }
           }
           else if(rentShare_frequency != undefined && rentShare_frequency == "fortnight")
           {
                total_expense = total_expense+rentShare*2;
                 if(liabilities !=undefined && liabilities.length >=1)
               {
                   for(var j =0;j<liabilities.length;j++)
                   {
                       if(liabilities[j].Payment_Frequency == "month")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount;
                       }
                       else if(liabilities[j].Payment_Frequency == "week")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount*4;
                       }
                       else if(liabilities[j].Payment_Frequency == "fortnight")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount*2;
                       }
                       else{
                           total_expense=total_expense;
                       }
                   }
               }
           }
           else
           {
                total_expense = total_expense;
                 if(liabilities !=undefined && liabilities.length >=1)
               {
                   for(var j =0;j<liabilities.length;j++)
                   {
                       if(liabilities[j].Payment_Frequency == "month")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount;
                       }
                       else if(liabilities[j].Payment_Frequency == "week")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount*4;
                       }
                       else if(liabilities[j].Payment_Frequency == "fortnight")
                       {
                           total_expense=total_expense+liabilities[j].Payable_Amount*2;
                       }
                       else{
                           total_expense=total_expense;
                       }
                   }
               }
           }
       }*/
         var formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'AUD',
                minimumFractionDigits: 2,
            });
        this.chart_Flag=true;
    this.barChartLabels = [ "Expenses " , "EMI", "Balance" ];
    console.log("Everything",total_expense,emi,(total_earning-total_expense-emi))
   this.barChartData = [total_expense,emi,(total_earning-total_expense-emi)];
  //this.barChartData =[10,15,20];
  this.total_emi_show=formatter.format(emi);
  this.total_expense_show=formatter.format(total_expense);
  this.total_remaining_show=formatter.format((total_earning - total_expense-emi));
   this.userExistingFlag = this.oaoService.getUserExistingFlag();


    }

    

   gotoLoan()
   {    var x = "DB201706295345"
       console.log("gotoloan",this.model.application_id);
        
       this.oaoService.updatesection("section_2",this.model.application_id)
       .subscribe(
           data => {
                    // this.oaoService.setData(data.Result);
                    console.log("in data",data);
                    this.router.navigate(['../loanDetails'],{relativeTo:this.route});
           }
       )
   }
   goBack(){
       window.history.back();
   }
    onSubmitMain() {
         console.log("onSubmitMain()");
         this.router.navigate(['../aboutYou'],{relativeTo:this.route});
         
   

    }
  
    ngOnInit() {
    
    }
   
   

}