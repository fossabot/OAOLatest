export class PersonalDetailsObject {
    constructor(
        public product_type_code:string,
       
      
        public singleORjoint:string,
        public title:string,
        public fname: string,
        public mname: string,
        public lname: string,
        public dob: string,
        public verification_auto?:boolean,
        public email?: string,
        public applicant?: string,
        public secondaryApplicantRefID?: string,
        public mobile?: string,
        public sec_1_v?: boolean,
        public sec_2_v?: boolean,
        public sec_3_v?: boolean,
        public sec_4_v?: boolean,
        public no_of_section?: any,
        public campaign_id?: any,
        public product_name?: string,
        public primaryApplicantName?: string,//for mail to secondary
        public section_SAV?: any,
        public section_HML?: any,
        public section_PRL?: any,
        public tfn?: string,
        public DLidState?: string,
        public LNum?: string,
        public color?: string,
        public idnum?: string,
        public idstate?: string,
        public refnum?: string,
        public validTo?: string,
        public exemption?: string,
        public housenum?: string,
        public streetnum?: string,
        public streetname?: string,
        public streettype?: string,
        public suburb?: string,
        public state?: string,
        public postcode?: string,
        public address?: string,
        public phousenum?: string,
        public pstreetnum?: string,
        public pstreetname?: string,
        public pstreettype?: string,
        public psuburb?: string,
        public pstate?: string,
        public ppostcode?: string,
        public paddress?: string,
        public app_id?:String,
        public application_id?:String,
        public meidicarenum?:String,  
        public core_account_number?:String,
        public core_customer_id?:Number,
        public bank_bsb_number?:String,         
        public postal_home_address_flag?:Boolean,
        public no_address_found_flag?:string,
        public skip?:boolean,
        public adminId?:string,
        public is_admin?:boolean,
        //for home loan
        public loantype?: string,
        public property?: string,
        public proptype?: string,
        public payoutbal?: string,
        public propaddr?: string,
        public purchaseprice?: string,
        public amtborrow?: string,
        public loanterm?: string,
        public frequencyType?: string,

        public years?: string,
        public months?: string,
        public fullname?: string,
        public phone?: string,
        public anotheryears?: string,
        public anothermonths?: string,
        public newaddress?: string,
        public newhousenum?: string,
        public newstreetnum?: string,
        public newstreetname?: string,
        public newstreettype?: string,
        public newsuburb?: string,
        public newstate?: string,
        public newpostcode?: string,
        // public loanterm_n?:string,
        public repaymenttype?:string,
		public repaymentAmount?:string,
        public emi?:number,
        public totalMortgage?:number,
        public establishment_fees?:string,
        public loan_service_fees?:string,
        public interesttype?:string,
        public interest_rate?:string,
        public fixedper?:string,
        public variableper?:string,
        public consolidateMortage?:boolean,
        public estvalue?:string,
        public propaddress_m?:string,
        public finInstitution?:string,
        public consolidateotherMortage?:boolean,
        public cc_estvalue?:string,
        public cc_finInstitution?:string,
        public pl_estvalue?:string,
        public pl_finInstitution?:string,
        public cl_estvalue?:string,
        public cl_finInstitution?:string,
        public sl_estvalue?:string,
        public sl_finInstitution?:string,
        public o_estvalue?:string,
        public o_finInstitution?:string,
        public employed?:string,
        public employer?:string,
        public service?:string,
        public companyName?:string,
        public yearsEstablished?:string,
        public earnPerMonth?:string,
        public incomeFrequency?:string,
        public secondJob?:boolean,
        public secondJobEarning?:string,
        public secondJobIncomeFrequency?:string,
        public monthlyLivingExpenses?:string,
        public ownership?:string,
        public assettype?:string,
        public assetvalue?:string,
        public Liabilitiestype?:string,
        public Payable_Amount?:string,
        public Payment_Frequency?:string,
        public Balance_Pending?:string,
        public Financial_Institution?:string,
        public rentalincome?:string,
        public assets?:any,
        public Liabilities?:any,
        public asset_liability?:boolean,
           public main_app_no?:String,
         public main_prod_type?:String,
          public main_prod?:String,  
        public minimumAge?: number,
        public maximumAge?: number,
        //for personal loan
        public loanreason?:any,
        public existing_cust_status?:string, //chandan
      
        public userName?:string, //chandan
        public product_code?:string,
         
         //for home loan 
         public prophousenum?: string,
        public propstreetnum?: string,
        public propstreetname?: string,
        public propstreettype?: string,
        public propsuburb?: string,
        public propstate?: string,
        public proppostcode?: string,
        public otherIncome?: boolean,
        public otherIncomeEarning?:string,
        public otherIncomeFrequency?:string,
        public otherIncomeSource?:string,
        public otherIncomeData?: any,
        public supportFinancially?:string,
        public relationshipStatus?:string,
        public livingType?:string,
        public rentShare?:string,
        public frequencyOfRent?:string,
        //
        public brokerid?: string,
        //
        public prophousenum_m?: string,
        public propstreetnum_m?: string,
        public propstreetname_m?: string,
        public propstreettype_m?: string,
        public propsuburb_m?: string,
        public propstate_m?: string,
        public proppostcode_m?: string,
        public sectionCount?: number,
        public progressBarConfig?: string[],
        public application_status?: string,
public foodExpense?: string,
        public healthCareExpense?: string,
        public transportExpense?: string,
        public childcareExpense?: string,
        public billsExpense?: string,
        public clothingExpense?: string,
        public travelExpense?: string,
        public otherExpense?: string,
        public foodExpenseFrequency?: string,
        public healthCareExpenseFrequency?: string,
        public transportExpenseFrequency?: string,
        public childcareExpenseFrequency?: string,
        public billsExpenseFrequency?: string,
        public clothingExpenseFrequency?: string,
        public travelExpenseFrequency?: string,
        public otherExpenseFrequency?: string,
        public expenseFrequency?: string,
        public jointEmailOrComp?: boolean,
        public is_doc_upload?: boolean,
        public drivinglicense?: string,
        public onlineVerificationStatus?:boolean,
        public dlimagePath?:string
    ) {
        this.years = years
        this.months = months
        this.fullname = fullname
        this.phone = phone
        this.anotheryears = anotheryears
        this.anothermonths = anothermonths
        this.newaddress = newaddress
        this.newhousenum = newhousenum
        this.newstreetnum = newstreetnum
        this.newstreetname = newstreetname
        this.newstreettype = newstreettype
        this.newsuburb = newsuburb
        this.newstate = newstate
        this.newpostcode = newpostcode
        this.frequencyOfRent = frequencyOfRent;
        this.rentShare = rentShare;
        this.livingType = livingType;
        this.relationshipStatus = relationshipStatus;
        this.supportFinancially = supportFinancially;
        this.jointEmailOrComp = jointEmailOrComp;
        this.is_admin = is_admin;
        this.product_code = product_code;//chandan
        this.product_name = product_name;
        this.minimumAge = minimumAge;
        this.maximumAge= maximumAge;
        this.campaign_id = campaign_id;
        this.applicant = applicant;
        //this.product_type_code=product_type_code;
        this.userName=userName;//chandan
        this.adminId=adminId;
        this.existing_cust_status=existing_cust_status;//chandan
        this.no_of_section=no_of_section;
        this.section_SAV=section_SAV;
        this.section_HML=section_HML;
        this.section_PRL=section_PRL;
        this.product_type_code=product_type_code;
        this.singleORjoint=singleORjoint;
	this.sec_1_v=sec_1_v;
	this.sec_2_v=sec_2_v;
	this.sec_3_v=sec_3_v;
	this.sec_4_v=sec_4_v;
        this.fname=fname;
        this.mname=mname;
        this.lname=lname;
        this.dob=dob;
        this.email=email;
        this.mobile=mobile;
        this.tfn=tfn;
        this.DLidState=DLidState;
        this.LNum=LNum;
        this.color=color;
        this.idnum=idnum;
        this.idstate=idstate;
        this.refnum=refnum;
        this.validTo=validTo;
        this.exemption=exemption;
        this.housenum=housenum
        this.streetnum=streetnum
        this.streetname=streetname
        this.streettype=streettype
        this.suburb=suburb
        this.state=state
        this.postcode=postcode
        this.address=address
        this.phousenum=phousenum
        this.pstreetnum=pstreetnum
        this.pstreetname=pstreetname
        this.pstreettype=pstreettype
        this.psuburb=psuburb
        this.pstate=pstate
        this.ppostcode=ppostcode
        this.paddress=paddress
        this.app_id=app_id
        this.application_id=application_id
        this.meidicarenum=meidicarenum
        this.core_customer_id=core_customer_id
        this.core_account_number=core_account_number
        this.bank_bsb_number=bank_bsb_number
        this.postal_home_address_flag=postal_home_address_flag
        this.no_address_found_flag=no_address_found_flag
        this.skip=skip
        this.title=title

        //for home loan
        this.totalMortgage=totalMortgage;
        this.loantype=loantype;
		 this.repaymentAmount=repaymentAmount;
        this.property=property;
        this.proptype=proptype;
        this.payoutbal=payoutbal;
        this.propaddr=propaddr;
        this.purchaseprice=purchaseprice;
        this.amtborrow=amtborrow;
        this.loanterm=loanterm;
        this.frequencyType=frequencyType;
        this.emi=emi;
        this.interest_rate=interest_rate;
        this.establishment_fees=establishment_fees;
        this.loan_service_fees=loan_service_fees;


        this.prophousenum=prophousenum
        this.proppostcode=proppostcode
        this.propstate=propstate
        this.propstreetname=propstate
        this.propstreetnum=propstreetnum
        this.propstreettype=propstreettype
        this.propsuburb=propsuburb


        this.prophousenum_m=prophousenum_m
        this.proppostcode_m=proppostcode_m
        this.propstate_m=propstate_m
        this.propstreetname_m=propstate_m
        this.propstreetnum_m=propstreetnum_m
        this.propstreettype_m=propstreettype_m
        this.propsuburb_m=propsuburb_m
        
        // this.loanterm_n=loanterm_n
        this.repaymenttype=repaymenttype
        this.interesttype=interesttype
        this.fixedper=fixedper
        this.variableper=variableper
        this.consolidateMortage=consolidateMortage
        this.estvalue=estvalue
        this.propaddress_m=propaddress_m
        this.finInstitution=finInstitution
        this.consolidateotherMortage=consolidateotherMortage
        this.cc_estvalue=cc_estvalue
        this.cc_finInstitution=cc_finInstitution
        this.pl_estvalue=pl_estvalue
        this.pl_finInstitution=pl_finInstitution
        this.cl_estvalue=cl_estvalue
        this.cl_finInstitution=cl_finInstitution
        this.sl_estvalue=sl_estvalue
        this.sl_finInstitution=sl_finInstitution
        this.o_estvalue=o_estvalue
        this.o_finInstitution=o_finInstitution
        this.employed=employed
        this.employer=employer
        this.service=service
        this.companyName=companyName
        this.yearsEstablished=yearsEstablished
        this.earnPerMonth=earnPerMonth
        this.incomeFrequency=incomeFrequency
        this.secondJobEarning=secondJobEarning
        this.secondJobIncomeFrequency=secondJobIncomeFrequency
        this.monthlyLivingExpenses=monthlyLivingExpenses
        this.ownership=ownership
        this.assettype=assettype
        this.assetvalue=assetvalue
        this.Liabilitiestype=Liabilitiestype
        this.Payable_Amount
        this. Payment_Frequency
        this. Balance_Pending
        this. Financial_Institution
        this.rentalincome=rentalincome
        this.assets=assets
        this.Liabilities=Liabilities
        this.asset_liability=asset_liability
        this.loanreason=loanreason

        this.brokerid=brokerid
        this.sectionCount = sectionCount
        this.progressBarConfig = progressBarConfig
        this.otherIncome=otherIncome
        this.otherIncomeEarning=otherIncomeEarning
        this.otherIncomeFrequency=otherIncomeFrequency
        this.otherIncomeSource=otherIncomeSource
        //for cross sell

        this.main_app_no = main_app_no
        this.main_prod_type = main_prod_type
        this.main_prod = main_prod
        this.application_status = application_status;


        this.foodExpense = foodExpense;
        this.healthCareExpense = healthCareExpense;
        this.transportExpense = transportExpense;
        this.childcareExpense = childcareExpense;
        this.billsExpense = billsExpense;
        this.clothingExpense = clothingExpense;
        this.travelExpense = travelExpense;
        this.otherExpense = otherExpense;

        this.foodExpenseFrequency = foodExpenseFrequency;
        this.healthCareExpenseFrequency = healthCareExpenseFrequency;
        this.transportExpenseFrequency = transportExpenseFrequency;
        this.childcareExpenseFrequency = childcareExpenseFrequency;
        this.billsExpenseFrequency = billsExpenseFrequency;
        this.clothingExpenseFrequency = clothingExpenseFrequency;
        this.travelExpenseFrequency = travelExpenseFrequency;
        this.otherExpenseFrequency = otherExpenseFrequency;
        this.expenseFrequency = expenseFrequency;
        this.is_doc_upload = is_doc_upload;
        this.drivinglicense = drivinglicense;
        this.onlineVerificationStatus = onlineVerificationStatus;
        this.dlimagePath = dlimagePath;
    }
}