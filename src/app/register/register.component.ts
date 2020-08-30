import { Component, ViewChild, ElementRef , EventEmitter, Output, OnInit, AfterViewInit, Input, ViewEncapsulation } from '@angular/core';
import {
  NgWizardConfig,
  NgWizardService,
  StepChangedArgs,
  STEP_STATE,
  THEME,
  TOOLBAR_BUTTON_POSITION
} from 'ng-wizard';
import { HostListener } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Location, Appearance, GermanAddress } from '@angular-material-extensions/google-maps-autocomplete';
// import {} from '@types/googlemaps';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, } from '@angular/cdk/drag-drop';
import { ToastrService } from 'ngx-toastr';
import PlaceResult = google.maps.places.PlaceResult;
import { invalid } from '@angular/compiler/src/render3/view/util';
import { KpiService } from '../services/kpi.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent implements OnInit {

  constructor(private toastr: ToastrService, public restApi: KpiService, private ngWizardService: NgWizardService, private fb: FormBuilder, private titleService: Title, private formBuilder: FormBuilder) {

  }
  /////////////////////////////
  get f() { return this.registerForm.controls; }
  get fc() { return this.companyForm.controls; }
  get ff() { return this.formulaForm.controls; }
  get ftc() { return this.tscsForm.controls; }

  allkpis: any = [];
  allParams: any = [];
  Unitesall: any = [];
  Opall: any = [];
  //Products: any = [];
  hiddenparam: Boolean = true;
  params: Boolean = false;
  unite: Boolean = false;
  operations: Boolean = false;
  useformula: Boolean = true;
  countries = [];
  dropdownList = [];
  selectedItems = [];
  dropdownSettings: IDropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
/*========================================
           STEP CHENGER WIZARD
 =========================================*/
  stepChangedArgs: StepChangedArgs;
  selectedtheme: THEME;
  themes = [THEME.default, THEME.arrows, THEME.circles, THEME.dots];
  stepStates = {
    normal: STEP_STATE.normal,
    disabled: STEP_STATE.disabled,
    error: STEP_STATE.error,
    hidden: STEP_STATE.hidden
  };
  ts: Boolean = false;
  laststep: Boolean = false;
  config: NgWizardConfig = {
    selected: 0,
    theme: THEME.arrows,
    toolbarSettings: {
      toolbarButtonPosition: TOOLBAR_BUTTON_POSITION.end,

    }
  };

  // BASE DROP DOWN LIST STEP 2
  Products = [
    'kpi',
    'Automate my business process',
    'Digitize my work instructions',
    'Digitize my project management',
    'Connect machines and equipment',
    'other'
  ];
 
  listOfSelectedValue: string[] = [];


  
/*========================================
           SUBMIT METHODE
 =========================================*/
  idUser = '';
  idCompany = '';
  idFormula = '';
  idKpi = '';
  k = 0;
/*========================================
           DROP DOWN LIST STEP 3
 =========================================*/
  listOfOption = new Array();
  listOfOptionid = new Array();
  listOfSelectedOptionid = new Array();
  fetchedlistOfoptions = new Array();
  fetchedlistOfoptionsid = new Array();
  listOfnewformulasid = new Array();

  
  newitem: Boolean = false;
  Newitems = new Array();
index = 0;

  emptylist: Boolean = false;
  success: Boolean = false;
  basketempty: Boolean = false;
/*========================================
           DRAG AND DROP
 =========================================*/

  // BASE
  timePeriods = [
    'Bronze age',
    'Iron age',
    'Middle ages',
    'Early modern period',
    'Long nineteenth century'
  ];
  // LOAD PARAMS
  finalBasket = new Array();
  allitems = new Array();
  allitemsid = new Array();
  allselecteditemsid = new Array();
  items = new Array();

  allunities = new Array();
  allunitesid = new Array();
  allselectedunitesid = new Array();
  unities = new Array();

  allops = new Array();
  ops = new Array();
  parenthesies = new Array();
  opindex = 0;
  allopsid = new Array();
  allselectedopsid = new Array();
  basket = [];

  n: number;
  nops: number;
  nunities: number;
  localmove: number;

  // RECAPTCHA
  /*recaptcha: any[];
  resolved(captchaResponse:any[]){
    this.recaptcha=captchaResponse;
    console.log(this.recaptcha);
  }*/

  lat = 51.673858;
  lng = 7.815982;

  public appearance = Appearance;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  public selectedAddress: PlaceResult;

  registerForm: FormGroup;
  companyForm: FormGroup;
  formulaForm: FormGroup;
  tscsForm: FormGroup;


  submitted = false;


  showprev: Boolean = true;
  shownext: Boolean = true;
  step1: Boolean = false;
  step2: Boolean = false;
  step3: Boolean = false;
  step4: Boolean = false;

  ngOnInit(): void {

    /** Load kpis**/
    this.loadAllKpis();

    /** Load Params**/
    this.loadAllParams();

    /** Load Unites**/
    this.loadAllUnites();

     /** Load Operations**/
    this.loadAllOperations();


    /** Form control**/
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8)]],

    });

    this.companyForm = this.formBuilder.group({
      Name: ['', Validators.required],
      field: ['', Validators.required],
      country: ['', [Validators.required]],
      region: ['', [Validators.required]]
     
    });

    this.formulaForm = this.formBuilder.group({
      formula: ['', Validators.required],
      users: ['', [Validators.required]],
      sensors: ['', [Validators.required]],
    });

    this.tscsForm = this.formBuilder.group({
      acceptTerms: [false, Validators.requiredTrue]
    });
    /** WIZARD THEME**/
    this.selectedtheme = this.config.theme;
    /**GOOGLE MAPS API**/
    this.titleService.setTitle('Home | @angular-material-extensions/google-maps-autocomplete');
    this.zoom = 10;
    this.latitude = 52.520008;
    this.longitude = 13.404954;
    this.setCurrentPosition();
  }
  finish(){
    this.submitted = true;
    if(this.step2 === true && !this.companyForm.invalid && !this.tscsForm.invalid){
      alert('Finishedhh!!!');
      this.submitted = false;
     }

   /* if (this.step3 === false ){
      return;
   }*/
  
    if (this.step3 === true && !this.tscsForm.invalid){

    // submit event
    console.log(this.companyForm.value);
    console.log(this.registerForm.value);
    console.log(this.formulaForm.value);
    // GET KPIS IDS + CREATE NEW FORMULA FOR NEW KPIS
    for (const s in this.listOfSelectedValue){
      for (const l in this.fetchedlistOfoptions){
       if (this.listOfSelectedValue[s] === this.fetchedlistOfoptions[l]){
         this.listOfSelectedOptionid.push(this.fetchedlistOfoptionsid[l]);
       }
    }}

      // ADD NEW USER
    this.restApi.addUser('username3', this.registerForm.value.firstName, this.registerForm.value.lastName, this.registerForm.value.email, this.registerForm.value.phone)
      .subscribe(data => {
        console.log(data);
        this.idUser = data.id;
        console.log(this.idUser);
           // ADD NEW COMPANY
        this.restApi.addCompany(this.companyForm.value.Name, this.companyForm.value.field, this.companyForm.value.country, this.companyForm.value.region, this.formulaForm.value.users, this.formulaForm.value.sensors)
      .subscribe(data => {console.log(data);
                          this.idCompany = data.id;
                          console.log(this.idCompany);
       // ADD USER TO COMPANY
                          this.restApi.addUserToCompany(this.idUser, this.idCompany)
     .subscribe(data => console.log(data), error => console.log(error));
        // ADD KPI TO COMPANY
                          for (const i in this.listOfSelectedOptionid){
       this.restApi.addkpiToCompany(this.listOfSelectedOptionid[i], this.idCompany)
       .subscribe(data => console.log(data), error => console.log(error));
     }
      }, error => console.log(error));

      }, error => console.log(error) );

      
    alert('Finished!!!');
    this.submitted = false;
    // this.ts=false;
    }
  }

/*========================================
      SCROLLY (navbar animation) ;)
 =========================================*/
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const element = document.querySelector('.navbar');
    if (window.pageYOffset > element.clientHeight) {
      element.classList.add('navbar-scroll');
    } else {
      element.classList.remove('navbar-scroll');
    }
  }
/*========================================
     Load KPIS consuming RESTful API
 =========================================*/



  loadAllKpis() {

    return this.restApi.getAllKpis().subscribe((data: {}) => {
      this.allkpis = data;
      console.log(data);
      for (const i in this.allkpis){
        console.log(this.allkpis[i].name);
        this.listOfOption.push(this.allkpis[i].name);
        this.fetchedlistOfoptions.push(this.allkpis[i].name);
        this.listOfOptionid.push(this.allkpis[i].id);
        this.fetchedlistOfoptionsid.push(this.allkpis[i].id);
        console.log(this.listOfOption);
      }
    });

  }
  isNotSelected(value: string): boolean {

   // this.emptylist=false;
   /*console.log("list of options  "+this.listOfOption);
   console.log("list of options id  "+this.listOfOptionid);*/
   //console.log("list of selected options  "+this.listOfSelectedValue);


        return this.listOfSelectedValue.indexOf(value) === -1;

  }   addItem(input: HTMLInputElement): void {


    const value = input.value;
    if (this.listOfOption.indexOf(value) === -1) {
      this.listOfOption = [...this.listOfOption, input.value || `New item ${this.index++}`];
      this.emptylist = false;
      console.log('list of options' + this.listOfOption);
      this.Newitems = [...this.Newitems, input.value ];
      console.log('list of new options' + this.Newitems);
      // CREATE NEW KPI
      this.restApi.addKpi(input.value)
      .subscribe(data => {console.log(data);
                          this.idKpi = data.id;
                          this.listOfSelectedOptionid.push(this.idKpi);

                          console.log('new kpi' + this.idKpi);

                          console.log('ids of new ' + this.listOfSelectedOptionid);
      }, error => console.log(error) );


          // CREATE NEW FORMULA
      this.restApi.addFormula(input.value)
        .subscribe(data => {console.log(data);
                            this.idFormula = data.id;
                            this.listOfnewformulasid.push(this.idFormula);

                            console.log('ADDED NEW FORMULA ' + this.idFormula);
        }, error => console.log(error) );


    }
    this.listOfSelectedValue = [...this.listOfSelectedValue, input.value];
    input.value = '';
    this.newitem = !this.newitem;
    this.emptylist = false;


      }

  addFormula() {
    if (this.basket.length === 0){
      this.basketempty = true;
      return;
    }
    this.newitem = !this.newitem;
    this.toastr.success('Success!', 'Formula added successfully', {
      timeOut: 1000
    });
    this.basket.splice(0, this.basket.length);
    this.params = false;
    this.unite = false;
    this.operations = false;
    this.hiddenparam = true;
    this.success = true;
    this.basketempty = false;

    // add formula to kpi DB + add params unites and operations


    for (const k in this.listOfSelectedOptionid){

           this.restApi.addFormulaToKpi(this.listOfnewformulasid[k], this.listOfSelectedOptionid[k])
          .subscribe(data => {console.log(data);


              // ADD SELECTED PARAMETERS TO FORMULA
                              for (const i in this.allselecteditemsid){
               this.restApi.addParameterToFormula( this.allselecteditemsid[i], this.idFormula)
               .subscribe(data => console.log(data), error => console.log(error));
             }

                // ADD SELECTED UNITES TO FORMULA
                              for (const i in this.allselectedunitesid){
                 this.restApi.addUniteToFormula(this.allselectedunitesid[i], this.idFormula)
                 .subscribe(data => console.log(data), error => console.log(error));
               }

                  // ADD SELECTED OPERATIONS TO FORMULA
                              for (const i in this.allselectedopsid){
               this.restApi.addOperationToFormula(this.allselectedopsid[i], this.idFormula)
               .subscribe(data => console.log(data), error => console.log(error));
             }

          }, error => console.log(error));
        }


  }
  ResetFormula(){
    this.basket.splice(0, this.basket.length);
    this.params = false;
    this.unite = false;
    this.operations = false;
    this.hiddenparam = true;
  }



  cancel(){
    this.newitem = !this.newitem;
    this.basket.splice(0, this.basket.length);
    this.params = false;
    this.unite = false;
    this.operations = false;
    this.hiddenparam = true;
    this.success = true;
    // this.basketempty=false;

  }

  dropME(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.timePeriods, event.previousIndex, event.currentIndex);
  }

  loadAllParams(){

    return this.restApi.getAllParams().subscribe((data: {}) => {
      this.allParams = data;
      for (const i in this.allParams){
        this.allitems.push(this.allParams[i].name);
        this.items.push(this.allParams[i].name);
        this.allitemsid.push(this.allParams[i].id);
      }
      console.log(this.items + 'list of params ids' + this.allitemsid);
    });

  }

  loadAllUnites(){

    return this.restApi.getAllUnites().subscribe((data: {}) => {
      this.Unitesall = data;
      for (const i in this.Unitesall){
        this.allunities.push(this.Unitesall[i].name);
        this.unities.push(this.Unitesall[i].name);
        this.allunitesid.push(this.Unitesall[i].id);

      }
      console.log(this.unities + 'list of unites ids' + this.allunitesid);
    });

  }

  loadAllOperations(){

    return this.restApi.getAllOps().subscribe((data: {}) => {
      this.Opall = data;
      console.log('opall' + this.Opall);
      for (const i in this.Opall){
        if (this.Opall[i].name === '('  || this.Opall[i].name === ')'){
          this.parenthesies.push(this.Opall[i].name);
        }else {
        this.allops.push(this.Opall[i].name);
        }
        this.ops.push(this.Opall[i].name);
        this.allopsid.push(this.Opall[i].id);

      }
      for (const o in this.ops){

        if (this.ops[o] === '(' ){
            // console.log(this.ops[o]);
            this.ops.splice(this.opindex, 1);
          }
        if ( this.ops[o] === ')' ){
            // console.log(this.ops[o]);
            this.ops.splice(this.opindex, 1);
          }
        this.opindex = this.opindex + 1;
        }
      console.log(this.allops + 'list of operation ids' + this.allopsid);


    }

    );

  }

  removeme(event: CdkDragDrop<string[]>, data_item: string) {

    this.basket = this.basket.filter(item => item !== data_item);
    if (this.basket.length === 0) {
      this.params = false;
      this.unite = false;
      this.operations = false;
      this.hiddenparam = true;

    }

    for (const i in this.allitems) {

      if (data_item === this.allitems[i]) {
        this.params = false;
        this.unite = false;
        this.operations = false;
        this.hiddenparam = true;

      }
    }


    for (const i in this.allops) {
      if (data_item === this.allops[i] && this.basket.length === 0) {
        this.params = false;
        this.unite = false;
        this.operations = false;
        this.hiddenparam = true;
      }else
      if (data_item === this.allops[i]) {
        this.params = true;
        this.unite = false;
        this.operations = true;
        this.hiddenparam = false;

      }

    }
    for (const i in this.allunities) {
      if (data_item === this.allunities[i]  && this.basket.length === 0) {
        this.params = false;
        this.unite = false;
        this.operations = false;
        this.hiddenparam = true;

      }else
      if (data_item === this.allunities[i]) {
        this.params = true;
        this.unite = true;
        this.operations = false;
        this.hiddenparam = true;

      }
    }


  }

  drop(event: CdkDragDrop<string[]>) {
    this.n = 0;
    this.nops = 0;
    this.nunities = 0;
    this.localmove = 0;
    if (event.previousContainer === event.container) {
     // moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
     moveItemInArray(this.basket, event.previousIndex, event.currentIndex);
    } else {
      copyArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    console.log('new' + event.container.data);
    console.log('pevious' + event.previousContainer.data);

    for (const i in event.container.data) {
      for (const j in event.previousContainer.data){
        if (event.container.data[i] === event.previousContainer.data[j]){
          this.localmove = this.localmove + 1;
        }
      }
    }

    if (this.localmove == event.container.data.length && this.localmove == event.previousContainer.data.length){
      this.params = false;
      this.unite = false;
      this.operations = false;
      this.hiddenparam = true;
    }


    this.finalBasket = event.container.data;
    /* calculating number of parameters in formula  */

    for (const i in this.allitems) {
      // var currentList = this.allitems[i];
      for (const y in event.container.data) {
        if (event.container.data[y] === this.allitems[i]) {
          // counting params
          this.n = this.n + 1;
          // adding param ids
          if (! this.allselecteditemsid.includes(this.allitemsid[i])){
            this.allselecteditemsid.push(this.allitemsid[i]);
          }

        }
      }
    }
    console.log(event.container.data + 'list of selected param ids' + this.allselecteditemsid);


    // console.log("params"+this.n)
    /* calculating number of ops in formula  */

    for (const i in this.allops) {
      // var currentList = this.allops[i];
      for (const y in event.container.data) {

        if (event.container.data[y] === this.allops[i]) {
          this.nops = this.nops + 1;

           // adding op ids
          if (! this.allselectedopsid.includes(this.allopsid[i])){
            this.allselectedopsid.push(this.allopsid[i]);
          }

        }
      }
    }
    console.log(event.container.data + 'list of selected op ids' + this.allselectedopsid);

    // console.log("operations"+this.nops)
    /* calculating number of unites in formula  */

    for (const i in this.allunities) {
      // var currentList = this.allunities[i];
      for (const y in event.container.data) {

        if (event.container.data[y] === this.allunities[i]) {
          this.nunities = this.nunities + 1;
           // adding unites ids
          if (! this.allselectedunitesid.includes(this.allunitesid[i])){

          this.allselectedunitesid.push(this.allunitesid[i]);
          }
        }
      }

    }
    console.log(event.container.data + 'list of selected op ids' + this.allselectedunitesid);

    if (this.n > this.nunities && this.n > this.nops) {

        this.params = true;
        this.hiddenparam = true;
        this.unite = true;
        this.operations = false;
    }
    if (this.n == this.nunities && this.n > this.nops) {
    this.params = true;
    this.hiddenparam = false;
    this.unite = false;
    this.operations = true;
    }
    if (this.n == this.nops && this.n == this.nunities) {

      this.params = false;
      this.hiddenparam = true;
      this.unite = false;
      this.operations = false;
    }
    if (this.n != 0 && this.n == this.nunities) {
      this.ops = this.allops;
    }

  }

  dropop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }

  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);
  }

 


  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  onAutocompleteSelected(result: PlaceResult) {
    console.log('onAutocompleteSelected: ', result);
  }

  onLocationSelected(location: Location) {
    console.log('onLocationSelected: ', location);
    this.latitude = location.latitude;
    this.longitude = location.longitude;
  }

  onGermanAddressMapped($event: GermanAddress) {
    console.log('onGermanAddressMapped', $event);
  }

  // drop down menu
  onItemSelect(item: any) {
    if(item === "kpi"){
      this.useformula=!this.useformula;
    }
    console.log(item);
    // this.emptylist=false;

  }
  onSelectAll(items: any) {
    console.log(items);
  }

  onSubmit() {
    console.log('I\'m here ?');
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
        return;
    }
    console.log('I\'m actually here ?');

    // display form values on success
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.registerForm.value, null, 4));
}


  showPreviousStep(event?: Event) {
    this.ngWizardService.previous();
  }

  showNextStep(event?: Event) {
    //console.log("products"+this.defaultOption);
    this.submitted = true;

    if (this.step1 === false && this.registerForm.invalid ){
       return;
    }
    if (this.step1 === true && !this.registerForm.invalid ){
      this.ngWizardService.next();
      this.submitted = false;


    }
    if (this.step2 === false && this.companyForm.invalid ){
      return;
   }
    if (this.step2 === true && !this.companyForm.invalid){
    this.ngWizardService.next();
    this.submitted = false;


  }
    if (this.listOfSelectedValue.length === 0 && this.step3 === true){
    this.emptylist = true;
    console.log(this.listOfSelectedValue);
    return;
  }
    if (this.listOfSelectedValue.length > 0 && this.step3 === true){
    this.emptylist = false;
    console.log(this.listOfSelectedValue);
    this.ngWizardService.next();
  }
   
    // console.log(this.registerForm.invalid);
    this.submitted = false;
    console.log(this.step1);
    console.log(this.step2);
    console.log(this.step4);
    this.emptylist = false;

    // this.registerForm.invalid=!this.registerForm.invalid ;

  }

  resetWizard(event?: Event) {
    this.selectedtheme = this.config.theme;
    this.ngWizardService.reset();
  }

  themeSelected() {
    this.ngWizardService.theme(this.selectedtheme);
  }

  stepChanged(args: StepChangedArgs) {
    console.log(args.step);
    if (args.step.title === 'Step 2' || args.step.title === 'Step 3' || args.step.title === 'Step 4'){
      this.showprev = false;
    }
    if (args.step.title === 'Step 1'){
      this.showprev = true;
      this.step1 = true;
    }
    if (args.step.title === 'Step 1' || args.step.title === 'Step 2' || args.step.title === 'Step 3'){
      this.shownext = true;
    }
    if (args.step.title === 'Step 4'){
      this.shownext = false;
      this.step4 = true;
      this.step1 = false;
      this.step2 = false;
    }
    if (args.step.title === 'Step 2'){
      this.step1 = false;
      this.step2 = true;
    }
    if (args.step.title === 'Step 3'){
      this.step1 = false;
      this.step2 = false;
      this.step3 = true;
    }

  }

  private setStepChangedArgs(args: StepChangedArgs) {
    args.step ? (args.step as any).__ngContext__ = undefined : {};
    args.previousStep ? (args.previousStep as any).__ngContext__ = undefined : {};

    setTimeout(() => {
      this.stepChangedArgs = args;
    }, 0);
  }
}
