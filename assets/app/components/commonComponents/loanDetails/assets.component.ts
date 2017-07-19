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
    selector: 'assets',
    templateUrl: 'assets.component.html'
})
export class AssetsComponent implements OnInit {
    model = new PersonalDetailsObject('', '', '', '', '', '', '');
    Assets: Assetdetails;
    showAssets: boolean =false;
    showLiabilities: boolean=false;
    liability_tab: boolean = false;
    public chartColors: any[] = [
      { 
        backgroundColor:["#109618", "#ff9900", "#990099", "#dc3912", "#3366cc"]  
      }];
       public barChartLabels: string[];
  public barChartData: any[];
  public barChartType: string;
  public isHML:boolean = false;
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
    public wrn_002: String;
    public inf_004: String;
    configMsg: ConfigDetails
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
        console.log("AssetsComponent  constructor()")
        this.barChartType = 'doughnut';
        this.chart_Flag=true;
    this.barChartLabels = ["Existing expenses/debts","New Loan Repayments","Total Remaining Amount"];
    //this.chart_proFlag = true;
    this.barChartData = [0,0,0];
   // this.barChartLegend = false;
        this.model=this.oaoService.getPersonalDetailsObject();
        this.isAdmin = this.model.is_admin;
        console.log(this.model);
        this.oaoService.getProductDetails(this.model.product_code).subscribe(
            data => {
                console.log("product details", data[0])
                console.log("Product type code",data[0].child_of);
                if(data[0].child_of=="HML"){
                this.isHML=true;
                }
                else
                {
                    this.isHML=false;
                }
                console.log(data[0].verification_mode);
                this.verification_auto = data[0].verification_mode;
            }
        )
        this.userExistingFlag = this.oaoService.getUserExistingFlag(); //chandan
        this.assetsDetails = [];
        this.LiabilitiesArray = [];
        this.model.assettype = "0";
        this.model.Liabilitiestype = "0";
        //for idCheck
        this.oaoService.GetPropertyDetails('turnOnOff', 'idCheck')
            .subscribe(
            data => {
                this.idCheck_v = data.result[0].property_value;
                console.log(data)
            }
            );
        //warning message 002
        this.oaoService.GetPropertyDetails('WARN_MESSAGE', 'WRN_002')
            .subscribe(
            data => {
                this.wrn_002 = data.result[0].property_value;
            }
            );
     
                console.log("assets check")
                console.log(this.model.Liabilities);
                console.log(this.model.assets);
               
                if(this.model.assets!=undefined ){
                    this.assetsDetails = this.model.assets
                }
                if(this.model.Liabilities!=undefined ){
                     this.LiabilitiesArray = this.model.Liabilities
                }
                if (this.model.assettype == null) {
                    this.model.assettype = '0'
                }
                if (this.model.Liabilitiestype == null) {
                    this.model.Liabilitiestype = '0'
                }
                if (this.model.Payment_Frequency == null) {
                    this.model.Payment_Frequency = '0'
                }
        // this.Assets = new Assetdetails('','');


        this.oaoService.GetPropertyDetails('GENERIC_PROP', 'ASSET_LIABILITY_MAX')
            .subscribe(
            data => {
                //console.log(data.result[0].property_value);
                this.MaxLimit = data.result[0].property_value;
            }
            );
             //this.tempDatasetLabel.push(data.Result[i]._id);
          //this.tempDataset.push(data.Result[i].count);
        //  this.barChartLabels = ["halua","puri"];
    //this.chart_proFlag = true;
   // this.barChartData = [2,3];
             this.oaoService.getConfig()
            .subscribe((data) => { this.configMsg = JSON.parse(JSON.stringify(data.data)); });
    }

    

    onSubmit() {
        //CommonUtils.completedProgressBarStep(2);
          console.log("onSubmit()")
        var assets = {
            'assettype': this.model.assettype,
            'assetvalue':  this.model.assetvalue.replace(/\,/g, "")
        };
        // var assetvalue =  this.model.assetvalue.replace(/\,/g, "");
        //  this.model.assetvalue = assetvalue;
        if (this.assetsLength <= this.MaxLimit) {
            this.assetsDetails.push(assets);
        }
        this.model.assets=this.assetsDetails;
		
        this.assetsLength = this.assetsDetails.length;
        this.oaoService.setPersonalDetailsObject(this.model);
        this.model.assettype="0";
        this.model.assetvalue=null;
        
    }
    onSubmitLiabilitiesDetails() {
          console.log("onSubmitLiabilitiesDetails()")
        var Liabilities = {
            'Liabilitiestype':  this.model.Liabilitiestype,
            'Payable_Amount':  this.model.Payable_Amount.replace(/\,/g, ""),
            'Payment_Frequency':  this.model.Payment_Frequency,
            'Balance_Pending':  this.model.Balance_Pending.replace(/\,/g, ""),
            'Financial_Institution':  this.model.Financial_Institution
        };
        // var Payable_Amount =  this.model.Payable_Amount.replace(/\,/g, "");
        //  this.model.Payable_Amount = Payable_Amount;
        // var Balance_Pending =  this.model.Balance_Pending.replace(/\,/g, "");
        //  this.model.Balance_Pending = Balance_Pending;
        if (this.LiabilitiesLength <= this.MaxLimit) {
            this.LiabilitiesArray.push(Liabilities);
        }
        this.model.Liabilities=this.LiabilitiesArray;
		 
        this.LiabilitiesLength = this.LiabilitiesArray.length;
        this.oaoService.setPersonalDetailsObject(this.model);
        this.model.Liabilitiestype="0";
        this.model.Payable_Amount=null;
        this.model.Payment_Frequency=null;
        this.model.Balance_Pending=null;
        this.model.Financial_Institution=null;
   
    }
    
    onSubmitMain() {
         console.log("onSubmitMain()")
         CommonUtils.completedProgressBarStep(2);
         this.isLoading=!this.isLoading;
        this.model.skip = false;
        this.model.verification_auto = this.verification_auto;
          console.log(this.model);
        switch (this.model.product_type_code) {
            case 'HML':                      
                        this.oaoService.OAOCreateOrUpdateHomeloanApplicant(this.model)
                        .subscribe(
                        data => {
                                this.router.navigate(['../expense_graph'], {relativeTo:this.route});
                            
                            }
                        );
                        break;
            case 'PRL': 
                    this.oaoService.OAOCreateOrUpdatePersonalloanApplicant(this.model)
                     .subscribe(
                     data => {
                            this.router.navigate(['../aboutYou'], {relativeTo:this.route});
                        
                    }
                );
                break;
            default: console.log("Page not found");
        }



    }
        
    updateSection() {
        this.oaoService.updatesection("section_3", this.model.application_id).subscribe(
            data => {
                console.log(data);
                console.log("updated");
                this.router.navigate(['../incomeExpense'],{relativeTo:this.route});
            }
        );
    }

    deleteassets(index) {
        this.assetsDetails.splice(index, 1);
        this.assetsLength = this.assetsDetails.length;


    }
    deleteLiabilities(index) {
        this.LiabilitiesArray.splice(index, 1);
        this.LiabilitiesLength = this.LiabilitiesArray.length;

    }

    ngOnInit() {
         CommonUtils.trimWhiteSpacesOnBlur();
         CommonUtils.activeProgressBarStep(3);
        CommonUtils.completedProgressBarStep(2)
         //CommonUtils.activeProgressBar();
         jQuery('#assettype').focus();
        //jQuery('#mlogin').hide();

        this.assetsLength = this.assetsDetails.length;
        this.LiabilitiesLength = this.LiabilitiesArray.length;
        console.log(this.LiabilitiesLength);
        this.oaoService.GetPropertyDetails('commonCodes', 'ASSET_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.assetType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'LIABILITY_TYPE')
            .subscribe(
            data => {
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.liabilityType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
        this.oaoService.GetPropertyDetails('commonCodes', 'FREQ_TYPE')
            .subscribe(
            data => {
                console.log("frequencey type",data.result);
                var count = Object.keys(data.result).length;
                for (var i = 0; i < count; i++) {
                    this.freqType.push({
                        prop_desc: data.result[i].property_desc,
                        prop_val: data.result[i].property_value
                    })
                }
            }
            );
    }
    clear() {
        window.location.reload();
        localStorage.clear();
    }
   
    addClass() {
        jQuery('#assettype').blur();
        jQuery('#Liabilitiestype').focus();
        this.liability_tab = true
    }
    moveToAssets(){
        this.liability_tab = false;
    }
    liabTab()
    {
        jQuery("#Liabilities-tab").trigger('click');
    }
    chartTab(){
        jQuery("#Chart-tab").trigger('click');
        console.log(this.model);
        console.log("sasa");
        //this.chart_Flag=true;
     //   this.barChartLabels = ["Existing expenses/debts","New Loan Repayments","Total Remaining Amount"];
    //this.chart_proFlag = true;
  //  this.barChartData = [2,3,4];
        this.renderExpenseChart();
    }
    renderExpenseChart() {
    //console.log("in rednder char 1", this.tempDataset);
   // this.chart_Flag=true;
    //this.barChartLabels = ["Existing expenses/debts","New Loan Repayments","Total Remaining Amount"];
    //this.chart_proFlag = true;
   // this.barChartData = [2,3,4];
  }
    AmountFormatter(amountvalue: any, var_v: any) {
     if(  amountvalue != undefined && amountvalue!=null && amountvalue!=''  ){
            console.log("asd "+amountvalue+" "+var_v)
            var formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'AUD',
            minimumFractionDigits: 2,
        });
        //     this.testmodel[var_v]="";
        //  this.testmodel[var_v]=amountvalue;
        var finalString = formatter.format(amountvalue);
		finalString = finalString.replace('A$','');
        this.model[var_v] = finalString.replace('$','');
    }else{
         this.model[var_v]="0.0";
    }
    }

    revert(oldvalue: any, var_v: any) {
        var tmpOldvalue;
        if (oldvalue != null && String(oldvalue).match(/\,/g)) {
            tmpOldvalue = oldvalue.replace(/\,/g, '');
            console.log(tmpOldvalue);
            this.model[var_v] = tmpOldvalue.substr(0, tmpOldvalue.length - 3);
            console.log(this.model[var_v]);
        }
    }

}