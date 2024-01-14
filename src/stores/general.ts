import { createContext } from 'react';
import { makeAutoObservable, observable } from 'mobx';

export class General {
  isLoggedIn: boolean = false;
  isLoadedTree: boolean = false;
  currentTreeJson: any[] = [];
  currentTreeJsonRow?: any = null;
  currentFilterRow: any = null;
  currentQueryRow: any = null;
  queries: any[] = [];
  queryGroups: any[] = [];
  groups: any[] = [];

  reportAggregation: any[] = [];
  quickSearchData: any[] = [];
  metaSearchData: any[] = [];
  transSearchData: any[] = [];
  combineSearchData: any[] = [];
  reportDetail: any[] = [];
  AllSearchPhrase: any[] = [];
  currentSeperatorIcon: string = 'DoubleChevronLeftMedMirrored';

  setSperatorIcon() {

    if (this.currentSeperatorIcon === 'DoubleChevronLeftMedMirrored') {
      this.currentSeperatorIcon = 'DoubleChevronLeftMed';
    }
    else {
      this.currentSeperatorIcon = 'DoubleChevronLeftMedMirrored';
    }
  }
  constructor() {
    // Call it here
    makeAutoObservable(this, {
      isLoggedIn: observable,
      currentTreeJson: observable,
      currentSeperatorIcon: observable,
      queries: observable,
      queryGroups: observable,
      groups: observable,
      reportAggregation: observable,
      reportDetail: observable,
      quickSearchData: observable,
      metaSearchData: observable,
      transSearchData: observable,
      combineSearchData: observable,
      AllSearchPhrase: observable
    
    })
  }
}
// decorate(General, {
//   isLoggedIn: observable,
//   currentTreeJson: observable,
//   currentSeperatorIcon: observable,
//   queries: observable,
//   queryGroups: observable,
//   groups: observable,
//   reportAggregation: observable,
//   reportDetail: observable,
//   quickSearchData: observable,
//   metaSearchData: observable,
//   transSearchData: observable,
//   combineSearchData: observable,
//   AllSearchPhrase: observable

// });
export default createContext(new General());
