const domElements={
 jobListings : document.querySelector('.jobs'),
 searchBox :document.querySelector('.search-box'),
 searchFilters : document.querySelector('.search-content'),
 clear : document.querySelector('.search-clear'),
};


// Get Data 
const fetchData = async ()=> {
  const res = await fetch("/data.json");
  const data = await res.json();

  return data;
};

//Make Job Postings 
function postJob(item) {
  return `
    ${listingBoarder(item.featured, item)}
    <div class="item"> 
          <div class="complogo"> 
          <img src="${item.logo}" alt="" >
          </div>
        
        <div class="compdescr">
        
              <div class ="maininfo">
                <span class="companyName"> ${item.company}</span>
                  ${createNewBanner(item.new, item.featured)}
              </div>
                <div class="jobTitle" > ${item.position}</div>
                  <div class="jobInfo">
                    <span class="postedDate"> ${item.postAt}</span>
                    <ul class ="jobfeatures">
                    <li class="contractInfo"> ${item.contract}</li>
                    <li class="locationInfo"> ${item.location}</li>
                    </ul>
                </div>
        </div>
                    <div class="jobSkills">
                      <span class="role filter"> ${item.role} </span>
                      <span class="level filter"> ${item.level}</span>
                      ${createLang(item.languages)}
                      ${createTools(item.tools)}
                    </div>
                
         </div>
    </div>

    `;
};


// Show cards
const showCards = () =>{
  let cards="";
  fetchData().then((data) => {
      data.forEach((text)=>{
          cards += makeCards(text);
          domElements.jobListings.innerHTML=cards;
      });
  })  
};

// Add featured boarder 
const listingBoarder = (featured) => {
  if(featured) {
    return `<div class="wrapper flex featured-border">`;
  }

  return `<div class="wrapper flex">`;
};

//create new job element
const createNewBanner = (newBan, featBanner) => {
  let banner="";
  if(newBan) banner +=`span class="new">New!</span>`
  if(featBanner) {
    banner +=`<span class="featured">Featured</span>`;
  }
  return banner;
};



// Create Language Cards
const createLang = (langs)=>{
  let langCards="";
  langs.forEach((lang)=>{
      langCards += `<span class="lang filter">${languages}</span>`;
  });
  return langCards;
};

// create tools ele
const createTools = (tools)=>{
  let toolEle ="";
  tools.forEach((tool)=>{
      toolEle += `<span class="langFilter">${tool}</span>`;
  });
  return toolEle;
};

//Display Search Bar
const displaySearch = (e) =>{
  let element=e.target;
  if(element.classList.contains('filter')){
      domElements.searchBox.classList.remove('hidden');
      displayFilter(element);
  }
};


let filterArray=[];

// Display filter on Search
const displayFilter = (ele) => {
  let filter="";
  if(! filterArray.includes(ele.textContent)){
      filterArray.push(ele.textContent);
  }  

  filterArray.forEach((element) => {
      filter +=`
      <div class="search-filter">
      <span class="filter-content">${element}
      <span class="filter-remove"> &#9747;</span>
      </span>
      </div> 
      `;
      domElements.searchFilters.innerHTML=filter;
      filterJob();
  })

};



// Update jobs list by changing filters
const filterJob = (data)=>{
  if(filterArray.length !== 0){
      let banner="";
      fetchData().then((data) => {
          data.forEach((text)=>{
                  if(validJobs(text)){
                   banner += showCards (text);
                  domElements.jobListings.innerHTML=banner;
              }
          });
      })  
  }
  else{
      domElements.searchBox.classList.add('hidden');
      showCards(data);
  }
};

// Jobs are valid or not
const validJobs = (item) => {
  let isValid = true;
  filterArray.forEach(elem => {
      if( item.role !== elem && item.level !== elem && !item.languages.includes(elem) && !item.tools.includes(elem)){
          isValid = false;
      }
  })
  return isValid;
};



// Remove filter
const removeFilter = (e) => {
  let element = e.target;
  if(element.classList.contains('filter-remove')){
      const elementToRemove=element.parentElement;
      let index = filterArray.indexOf(elementToRemove.textContent.split(" ")[0].trim());
      filterArray.splice(index,1);
      elementToRemove.remove();
      filterJob();
  }
};


// Clear Search
const clearSearch = () => {
  domElements.searchBox.classList.add('hidden');
  filterArray=[];
  filterJob();
};

// All DOM Event Listeners
domElements.jobListings.addEventListener('click',displaySearch);
domElements.searchFilters.addEventListener('click',removeFilter);
domElements.clear.addEventListener('click',clearSearch);