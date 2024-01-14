// import Tree from 'react-d3-tree';
import './custom-tree.css';
import { Slider } from '@fluentui/react/lib/Slider';
import {
  IContextualMenuProps, MessageBarButton, IButtonProps,
  MessageBar,
  MessageBarType, Label
} from '@fluentui/react';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { TooltipHost, ITooltipHostStyles } from '@fluentui/react/lib/Tooltip';
import { useId } from '@fluentui/react-hooks';
import { Image } from '@fluentui/react/lib/Image';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';

import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { FontSizes, getTheme, IRawStyle } from '@fluentui/react/lib/Styling';

import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { DatePicker, DayOfWeek, IDatePickerStrings } from '@fluentui/react';
// import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from '@fluentui/react-card';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import * as React from 'react';

import { DefaultButton, PrimaryButton, CommandBarButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { Separator } from '@fluentui/react/lib/Separator';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { useConstCallback } from '@fluentui/react-hooks';
import { Nav, INavStyles, INavLinkGroup, } from '@fluentui/react/lib/Nav';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
// import { Slider } from '@fluentui/react/lib/Slider';
import { useBoolean } from '@fluentui/react-hooks';
import {
  Stack, StackItem, Text, Link, FontWeights, DetailsList, SpinButton,
  IColumn, ITextStyles, IIconStyles, IIconProps, IStackTokens
} from '@fluentui/react';

// import { observer } from 'mobx-react-lite';
import General from './stores/general';
import { TranscriptTree } from './Tree';
// import { reaction } from 'mobx';
// const orgChart = 
// {
//   name: 'AND',
//   children: [
//     {
//       name: 'how are you',
//       attributes: {
//         text: "a9"
//       },
//       children: [
//         {
//           name: 'Or',
//           attributes: {
//             department: 'Fabrication',
//           },
//           children: [
//             {
//               name: 'Worker',
//             },
//           ],
//         },
//         {
//           name: 'Proximity',
//           attributes: {
//             department: 'Assembly',
//           },
//           children: [
//             {
//               name: 'Worker',
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };
const PAGEROWS = 10;
const iconClass = mergeStyles({
  fontSize: 16,
  height: 16,
  width: 16,
  margin: '1px 1px',
});
const iconCard = mergeStyles({
  // color: '#0078D4',
  fontSize: 16,
  fontWeight: FontWeights.regular,
});
const iconDarkgreen = mergeStyles({
  color: 'darkgreen',
  fontSize: 16,
  fontWeight: FontWeights.regular,
});
const iconSave = mergeStyles({
  color: 'red',
  fontSize: 16,
  fontWeight: FontWeights.regular,
});


const theme = getTheme();
const headerAndFooterStyles: IRawStyle = {
  // minWidth: 300,
  minHeight: 0,
  // lineHeight: 1,
  // paddingLeft: 1,
  padding: 0,
  margin: 0
};
const classNames = mergeStyleSets({
  deepSkyBlue: [{ color: 'deepskyblue' }, iconClass],
  greenYellow: [{ color: 'greenyellow' }, iconClass],
  red: [{ color: 'red' }, iconClass],
  darkgreen: [{ color: 'darkgreen' }, iconClass],
  cardRightIcon: [iconCard],
  iconSave: [iconSave],
  header: [headerAndFooterStyles, theme.fonts.medium],
  footer: [headerAndFooterStyles, theme.fonts.medium],
  name: {
    // display: 'inline-block',
    overflow: 'hidden',
    // height: 24,
    cursor: 'default',
    //padding: 8,
    boxSizing: 'border-box',
    verticalAlign: 'top',
    background: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    paddingLeft: 32,
  },
});

export interface IAggregateRow {
  Id: number
  HistPercent: number
  IsAdhoc: boolean
  QueryGroupId: number
  QueryId: number
  TotalByMetadata: number
  TotalByQuery: number
  pivotColumn: string
  pivotValue: string
  CreatedDate: string
}

const exampleChildClass = mergeStyles({
  display: 'block',
  marginBottom: '10px',
});
const TemplateJson = `{
  "operator": "or",
  "phraseGroups": [
    {
      "phrases": [
        {
          "text": "hi",
          "channel": 2,
          "isBetween": false,
          "fuzzy": 0
        }
      ],
      "groupLinkNext":{
        "interval": 0
      }
    }
  ],
  "subSearches": [
  {
    "operator": "or",
    "phraseGroups": [
      {
        "phrases": [
          {
            "text": "hello",
            "channel": 2,
            "isBetween": false,
            "fuzzy": 0
          }
        ],
        "groupLinkNext":{
          "interval": 0
        }
      }
    ]
  }]
}`;
const textFieldStyles: Partial<ITextFieldStyles> = { root: { minWidth: '600px' } };

export const App: React.FunctionComponent = (() => {
  const [, updateState] = React.useState({});
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const CardHeightDefault = '200px';
  const CardWidthDefault = '1024px';
  const [ShowQuickSearch, setShowQuickSearch] = React.useState(false);

  const [limit, setlimit] = React.useState(PAGEROWS);
  const qcolumns: IColumn[] = [];
  const [gJson, setGJson] = React.useState([])
  const [treeRootProp, setTreeRootProp] = React.useState<any>();
  const [CodeTypes, setCodeTypes] = React.useState<any[]>([]);
  const [Codes, setCodes] = React.useState<any[]>([]);
  const [Js, setJs] = React.useState<any[]>([]);
  const [Fs, setFs] = React.useState<any[]>([]);
  const [Queries, setQueries] = React.useState<any[]>([]);
  const [JSearches, setJSearches] = React.useState<any[]>([]);
  const [Filters, setFilters] = React.useState<any[]>([]);
  const [FilterDetails, setFilterDetails] = React.useState<any[]>([]);
  const [ListFilter, setListFilter] = React.useState<any>();

  const [QuickSearchColumns, setQuickSearchColumns] = React.useState(qcolumns);
  const [analystColumns, setanalystColumns] = React.useState(qcolumns);
  const [textTranscript, settextTranscript] = React.useState('');
  const [textMeta, settextMeta] = React.useState('');
  const [cardWidth, setcardWidth] = React.useState(CardWidthDefault);
  const [cardHeight, setcardHeight] = React.useState(CardHeightDefault);
  const [cardWidthTranscript, setcardWidthTranscript] = React.useState(CardWidthDefault);
  const [cardHeightTranscript, setcardHeightTranscript] = React.useState(CardHeightDefault);
  const [cardWidthCombine, setcardWidthCombine] = React.useState(CardWidthDefault);
  const [cardHeightCombine, setcardHeightCombine] = React.useState(CardHeightDefault);
  const [currentTranscript, setcurrentTranscript] = React.useState([]);
  const [dateRangeType, setdateRangeType] = React.useState('after');
  const verticalStyle = mergeStyles({
    height: '700px'
  });
  const [isFilterOpen, setFilterOpen] = React.useState(false);
  const openPanel = React.useCallback(() => { setFilterOpen(true) }, []);
  const dismissFilterPanel = React.useCallback(() => { setFilterOpen(false) }, []);

  const [isAnalystOpen, setisAnalystOpen] = React.useState(false);
  const openAnalystPanel = React.useCallback(() => { setisAnalystOpen(true) }, []);
  const dismissAnalystPanel = React.useCallback(() => {
    sethideCodeEdit(true);
    setisAnalystOpen(false);
  }, []);
  const [isTranscriptOpen, setIsTranscriptOpen] = React.useState(false);
  const dismissTranscriptPanel = React.useCallback(() => { setIsTranscriptOpen(false) }, []);
  const gState = React.useContext(General);
  const [seperatorIconName, setIconName] = React.useState(gState.currentSeperatorIcon);
  const [teachingBubbleVisible, { toggle: toggleTeachingBubbleVisible }] = useBoolean(false);
  const [localQueries, setlocalQueries] = React.useState(gState.queries);
  const [localAllSearchPhrase, setlocalAllSearchPhrase] = React.useState(gState.AllSearchPhrase);
  // var treeData: any[] =[
  //   { title: 'Chicken', children: [{ title: 'Egg' }] },
  //   { title: 'Fish', children: [{ title: 'fingerline' }] },
  // ];
  // var dtree:TreeItem[] =[
  //   { title: 'Chicken', children: [{ title: 'Egg' }] },
  //   { title: 'Fish', children: [{ title: 'fingerline' }] }
  // ];
  // const [treeData, setTreeData] = React.useState(dtree);

  const localPreprocessedReports = [{ id: 2, name: "Appreciation" }, { id: 3, name: "LogMeIn (LMI) Compliance Report" }, { id: 4, name: "Quick Assist Compliance" }, { id: 5, name: "Frequent Holds" }]
  const [businesGroupList, setbusinesGroupList] = React.useState([]);
  const [localQuickSearchData, setlocalQuickSearchData] = React.useState(gState.quickSearchData);
  const tpClearAllMeta = useId('tpClearAllMeta');
  const tpSave = useId('tpSave');
  const tpCleatFilterName = useId('tpCleatFilterName');
  const [timerMSecond, settimerMSecond] = React.useState(0);
  const [timerSecond, settimerSecond] = React.useState(0);
  const [isShowTimer, setisShowTimer] = React.useState(false);
  var sysTimerMSecond: any = null;
  var sysTimerSecond: any = null;
  //setlimit("20");
  const FilterMessage = () => (
    <MessageBar
      messageBarType={MessageBarType.warning}
      isMultiline={false}
      onDismiss={() => setisMsgCollapsed(true)}
      dismissButtonAriaLabel="Close"
      actions={
        <div>
          <FontIcon onClick={() => setFilterOpen(true)} iconName={'Edit'} className={classNames.deepSkyBlue} />
        </div>
      }
    >
      {GetFilterForQuery()}
    </MessageBar>
  );
  const JsonSearchMessage = () => (
    <MessageBar
      messageBarType={MessageBarType.warning}
      isMultiline={false}
      onDismiss={() => setisMsgCollapsed(true)}
      dismissButtonAriaLabel="Close"
      actions={
        <div>
          <FontIcon onClick={() => clickShowTree()} iconName={'Edit'} className={classNames.deepSkyBlue} />
        </div>
      }
    >
      {JSON.stringify(gState.currentTreeJson[0])}
    </MessageBar>
  );

  const addOption = (options: IDropdownOption[], key: string, text: string) => {
    options.push({
      key: key,
      text: text
    });
  }
  const addColumn = (columns: IColumn[], fieldName: string, display: string, minWidth: number) => {
    columns.push({
      key: fieldName,
      name: display,
      fieldName: fieldName,
      ariaLabel: display,
      minWidth: minWidth,
      maxWidth: minWidth + 50,
      isResizable: true,
      isCollapsible: true,
    });
  }
  const loadAggColumns = (pivotColumn: string): IColumn[] => {
    const columns: IColumn[] = [];
    addColumn(columns, "pivotValue", pivotColumn, 80);
    addColumn(columns, "CreatedDate", 'Created Date', 50);
    addColumn(columns, "TotalByQuery", 'Total by Query', 80);
    addColumn(columns, "TotalByMetadata", 'Total by Metadata', 80);
    addColumn(columns, "HitsPercent", 'Hits Percent', 50);
    return columns;
  }
  var reportColumns: any[] = [];
  const URLPrefix = 'https://xiapi.azurewebsites.net/search';
  const URLIapWebApi = 'https://localhost:5001/WeatherForecast/';
  //const URLPrefix = 'https://localhost:5001/';
  const GetCodes = async () => {
    //////console.log("GetCodes");
    let slink = URLIapWebApi + "GetCodes";
    const rr = fetch(slink).then((response) => {
      //////console.log("GetCodes", response);
      if (response.status === 200) {

        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        setCodeTypes(data.cTs);
        setCodes(data.codes);
        setJs(data.js);
        setFs(data.fs);
        setFilterDetails(data.fds);
        //business group codeTypeId == 5
        const r = data.codes.filter((o: any) => o.codeTypeId == 5).map((entry: any) => {
          //////console.log('bg data', entry, entry.Id.toString(), entry.Name);
          return {
            key: entry.codeTypeId ? entry.codeTypeId.toString() + "." + entry.id.toString() : "",
            text: entry.name
          };
        })
        setbusinesGroupList(r);

        var mJsearch: any[] = [];
        if (data.js) {
          data.js.map((o: any, i: number) => {
            //////console.log('bg data', entry, entry.Id.toString(), entry.Name);
            mJsearch.push({
              key: o.id,
              text: o.name,
              value: o
              // iconProps: { iconName: 'TextBox' },
              // onClick: () => selectOneSearch(o)
            });
          });
        }
        setJSearches(mJsearch);
        var mQuery: any[] = [];
        if (data.qs) {
          data.qs.map((o: any, i: number) => {
            //////console.log('bg data', entry, entry.Id.toString(), entry.Name);
            mQuery.push({
              key: o.id,
              text: o.name,
              value: o
              // iconProps: { iconName: 'TextBox' },
              // onClick: () => selectOneSearch(o)
            });
          });
        }
        setQueries(mQuery);
        var mFilter: any[] = [];
        if (data.fs) {
          data.fs.map((o: any, i: number) => {
            //////console.log('bg data', entry, entry.Id.toString(), entry.Name);
            mFilter.push({
              key: o.id,
              text: o.name,
              value: o
              // iconProps: { iconName: 'TextBox' },
              // onClick: () => selectOneSearch(o)
            });
          });
        }
        setFilters(mFilter);
      }
      );
    return '';
  }
  const ToDateString = (d: Date) => {
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  //const TEMPFilter="";//filter=BusinessGroupId%20%3D%3D%2022%20and%20ProductId%20%3D%3D%20129%20and%20StartTime%20between%20%28datetime%282020-07-01%29%20..%20datetime%282020-08-01%29%29
  const RenmoveSquareFromJson = (s: string) => {
    var t = s.trim();//.replace(/(?:\r\n|\r|\n)/g,"");
    if (t.substring(0, 1) == "[") {
      t = t.substring(1, t.length - 1);
    }
    return t;
  }
  const getQuickSearchJsonString = (s: string) => {
    return `{
      "operator": "and",
      "phraseGroups": [
        {
          "phrases": [
            {
              "text": "` + s + `",
              "channel": 2,
              "isBetween": false,
              "fuzzy": 0
            }
          ],
          "groupLinkNext":{
            "interval": 0
          }
        }
      ]
    }`;
  }
  const GetJsonSearch = () => {
    var res = JSON.stringify(gState.currentTreeJson[0]);
    //////console.log('rrrr444', res);
    if (!res) {
      res = "{}";// TemplateJson;
      setJsonAndState(res, null);
    }
    return RenmoveSquareFromJson(res);
  };
  const GetCodeSelectedForOneCodeType = (a: string[]) => {
    var r = a.join(",");//.map((s:string, i:number)=> s.substring(s.indexOf(".") + 1)).join(",");
    return r;
  }
  const GetCodeSelectedWithoutCodeType = (a: string[]) => {
    var r = a.map((s: string, i: number) => s.substring(s.indexOf(".") + 1)).join(",");
    return r;
  }

  const GetFilterDetails = () => {
    var res: any[] = [];

    if (!gState.currentFilterRow) {
      allSelectedKeys.map((o: any, i: number) => {
        ////console.log('oooo11', o, o[0]);
        if (o.length > 0 && o[0]) {
          if (o[0].indexOf(".") > -1) {
            res.push({ id: 0, tagId: 0, filterId: 0, codeTypeId: o[0].substring(0, o[0].indexOf(".")), value: GetCodeSelectedForOneCodeType(o) })
          } else {
            res.push({ id: 0, tagId: 0, filterId: 0, codeTypeId: o[1], value: o[0] })
          }
        }
      }

      )
    } else {
      //////console.log("bgSelectedKeys", bgSelectedKeys, bgSelectedKeys.toString());
      allSelectedKeys.map((o: any, i: number) => {
        ////console.log('oooo22', o, o[0]);
        if (o.length > 0 && o[0]) {
          if (o[0].indexOf(".") > -1) {
            res.push({
              id: gState.currentFilterRow.id, tagId: 0, filterId: gState.currentFilterRow.id,
              codeTypeId: o[0].substring(0, o[0].indexOf(".")), value: GetCodeSelectedForOneCodeType(o)
            });
          }
          else {
            res.push({
              id: gState.currentFilterRow.id, tagId: 0, filterId: gState.currentFilterRow.id,
              codeTypeId: o[1], value: o[0]
            });
          }
        }
      }
      )
    }
    ////console.log("GetFilterDetails", res);
    return res;
  };

  const GetOneFilterConditionByCodeTypeAndValues = (codetype: string, commaSeperatedValue: string) => {
    var a = CodeTypes.filter((item: any) => item.id == codetype);
    if (a.length > 0) {
      var codeTypeName = a[0].filedName;
      var dataType = a[0].dataType;
      switch (dataType) {
        case "long":
          return codeTypeName + " in(" + commaSeperatedValue + ")";
        case "string":
          return codeTypeName + " in(" + commaSeperatedValue.split(",").map((v: string) => "\"" + v + "\"").join(",") + ")";
        default:
          break;
      }
    }
    return "";
  }
  const GetFilterWithoutDateRange = () => {
    var res: string[] = [];
    var codetype = "";
    var commaSeperatedValue = "";
    allSelectedKeys.map((o: any, i: number) => {
      ////console.log('oooo11', o, o[0]);
      if (o.length > 0 && o[0]) {
        if (o[0].indexOf(".") > -1) {
          codetype = o[0].substring(0, o[0].indexOf("."));
          commaSeperatedValue = GetCodeSelectedWithoutCodeType(o);
        } else {
          codetype = o[1];
          commaSeperatedValue = o[0];
        }
        if (codetype && commaSeperatedValue) res.push(GetOneFilterConditionByCodeTypeAndValues(codetype, commaSeperatedValue));
      }
    }
    )
    return res;
  };
  const GetFilterForQuery = () => {
    var res: string[] = [];
    //////console.log("GetFilterForQuery", startDate, endDate);
    if (startDate && endDate) {
      res.push("StartTime between (datetime(" + ToDateString(startDate) + ") .. datetime(" + ToDateString(endDate) + "))");
    }
    else if (startDate) {
      res.push("StartTime > datetime(" + ToDateString(startDate) + ")");
    } else if (endDate) {
      res.push("StartTime < datetime(" + ToDateString(endDate) + ")");
    }
    var detailFilter = GetFilterWithoutDateRange();
    res = res.concat(detailFilter);
    var s = res.join(" and ");
    if (s) s = "filter=" + s;
    else s = "filter=1==1"
    return s;
  };
  const [lastFilter, setlastFilter] = React.useState("old");
  const [lastJsonSearch, setlastJsonSearch] = React.useState("old");
  const QueryCount = async () => {
    var f = GetFilterForQuery();
    var j = GetJsonSearch();
    if (f == lastFilter && j == lastJsonSearch) return;
    settotalFiterRecords(0);
    settotalRecords(0);
    setlastFilter(f);
    setlastJsonSearch(j);
    let slink = URLIapWebApi + "QueryCount?" + f;
    const rr = fetch(slink, {
      method: 'post',
      body: j,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        ////console.log('my data count', data, data.totalByFilter, data.totalByQuery);
        settotalRecords(data.totalByQuery);
        settotalFiterRecords(data.totalByFilter);
      }
      );
    return '';
  }
  const UpdateJsonSearch = async (Id: number, name: string, json: string) => {
    console.log("json", json);
    let slink = URLIapWebApi + "UpdateJsonSearch?Id=" + Id.toString() + "&name=" + name;
    const rr = fetch(slink, {
      method: 'post',
      body: json,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        GetCodes();
        setshowTranscriptSearchSaved(true);
        setTimeout(() => {
          setshowTranscriptSearchSaved(false);
        }, 5000);
      }
      );
    return '';
  }

  const UpdateQuery = async (Id: number, name: string, filterId: number, filter: string, jId: number, json: string, startDate?: Date, endDate?: Date) => {
    var start = startDate ? ToDateString(startDate) : "";
    var end = endDate ? ToDateString(endDate) : "";
    let slink = URLIapWebApi + "UpdateQuery?Id=" + Id.toString() + "&name=" + name + "&startDate=" + start + "&endDate=" + end
      + "&filterId=" + filterId + "&jId=" + jId;
    const rr = fetch(slink, {
      method: 'post',
      body: JSON.stringify({ Filter: filter, Json: json }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        GetCodes();
        setshowQuerySaved(true);
        setTimeout(() => {
          setshowQuerySaved(false);
        }, 5000);
      }
      );
    return '';
  }
  const AddQuery = async (name: string, filterId: number, filter: string, jId: number, json: string, startDate?: Date, endDate?: Date) => {
    var start = startDate ? ToDateString(startDate) : "";
    var end = endDate ? ToDateString(endDate) : "";
    let slink = URLIapWebApi + "AddQuery?name=" + name + "&startDate=" + start + "&endDate=" + end
      + "&filterId=" + filterId + "&jId=" + jId;
    console.log("addq", slink);
    const rr = fetch(slink, {
      method: 'post',
      body: JSON.stringify({ Filter: filter, Json: json }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        GetCodes();
        setshowQuerySaved(true);
        setTimeout(() => {
          setshowQuerySaved(false);
        }, 5000);
      }
      );
    return '';
  }
  const AddJsonSearch = async (name: string, json: string) => {
    let slink = URLIapWebApi + "AddJsonSearch?name=" + name;
    const rr = fetch(slink, {
      method: 'post',
      body: json,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        ////console.log('my add result', data);
        GetCodes();
        setshowTranscriptSearchSaved(true);
        setTimeout(() => {
          setshowTranscriptSearchSaved(false);
        }, 5000);
      }
      );
    return '';
  }
  const UpdateFilterSearch = async (Id: number, TagId: number, name: string, allSelectedCodeList: any[]) => {
    ////console.log("name", name);
    let slink = URLIapWebApi + "UpdateFilterSearch?Id=" + Id.toString() + "&TagId=" + TagId.toString() + "&name=" + name;
    const rr = fetch(slink, {
      method: 'post',
      body: JSON.stringify(allSelectedCodeList),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        GetCodes();
        setshowFilterSaved(true);
        setTimeout(() => {
          setshowFilterSaved(false);
        }, 5000);
      }
      );
    return '';
  }
  const AddFilterSearch = async (name: string, allSelectedCodeList: any[]) => {
    ////console.log("allSelectedCodeList", allSelectedCodeList);
    let slink = URLIapWebApi + "AddFilterSearch?name=" + name;
    const rr = fetch(slink, {
      method: 'post',
      body: JSON.stringify(allSelectedCodeList),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        ////console.log('my add result', data);
        GetCodes();
        setshowFilterSaved(true);
        setTimeout(() => {
          setshowFilterSaved(false);
        }, 5000);
      }
      );
    return '';
  }
  const Query = async (numPage: Number) => {
    let slink = URLIapWebApi + "Query?" + GetFilterForQuery() + "&numPage=" + numPage + "&pageRows=" + limit.toString();
    const rr = fetch(slink, {
      method: 'post',
      body: GetJsonSearch(),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        cleanTimer();
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        ////console.log('my data', data,data[0]);
        if (!data[0]) return '';
        gState.quickSearchData = data;
        var keyNames = data[0] ? Object.keys(data[0]) : [];
        var columns: IColumn[] = [];
        keyNames.forEach(v => {
          addColumn(columns, v, v, 80);
        });
        ////console.log('columns:', columns)
        setQuickSearchColumns(columns);
        setlocalQuickSearchData(data);
        setShowQuickSearch(true);
        cleanTimer();
        console.log("query is done");
      }
      );
    return '';
  }
  const cleanTimer = () => {
    setisShowTimer(false);
    clearTimeout(sysTimerMSecond);
    clearTimeout(sysTimerSecond);
  }
  const QueryTopN = async () => {
    let slink = URLIapWebApi + "QueryTopN?" + GetFilterForQuery() + "&pageRows=" + limit.toString();//filter=BusinessGroupId%20%3D%3D%2022%20and%20ProductId%20%3D%3D%20129%20and%20StartTime%20between%20%28datetime%282020-07-01%29%20..%20datetime%282020-08-01%29%29&pageRows=10";
    ////console.log("QueryTopN", slink, GetJsonSearch());
    const rr = fetch(slink, {
      method: 'post',
      body: GetJsonSearch(),//GetJsonSearch(),//JSON.stringify(search),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        cleanTimer();
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        ////console.log('my data', data, data.length);
        if (data && data.length > 0) {
          gState.quickSearchData = data;
          var keyNames = data[0] ? Object.keys(data[0]) : [];
          var columns: IColumn[] = [];
          keyNames.forEach(v => {
            if ("emailAddressphoneNumberdialedPhoneNumber".indexOf(v) < 0)
              addColumn(columns, v, v, 80);
          });
          ////console.log('columns:', columns)
          setQuickSearchColumns(columns);
          setlocalQuickSearchData(data);
          setShowQuickSearch(true);
          // setShowReport(false);
          QueryCount();
        } else {
          setlocalQuickSearchData(data);
          QueryCount();
        }
        cleanTimer();
      }
      );

    return '';
  }
  const GetTranscriptsById = async (Id: string) => {
    ////console.log("GetTranscriptsById");
    let slink = URLIapWebApi + "GetTranscriptsById?Id=" + Id;
    const rr = fetch(slink, {
      method: 'post',
      body: GetJsonSearch(),
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    }).then((response) => {
      ////console.log("Query22", response);
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        ////console.log('my data', data, data.length);
        if (data && data.length > 0) {
          setcurrentTranscript(data);
          setIsTranscriptOpen(true);
        } else {
        }
      }
      );
    return '';
  }

  const FormatDate = (date: Date): string => {
    return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
  };
  const FetchMetaSearch = async () => {
    ////console.log('business group bgSelectedKeys', bgSelectedKeys);
    const sStart = startDate ? FormatDate(startDate) : '';
    const sEnd = endDate ? FormatDate(endDate) : '';
    const ss = URLPrefix + "/MetaSearch?start=" + sStart + "&end=" + sEnd + "&bg=" + bgSelectedKeys + "&limit=20";// + limit;
    ////console.log('s=', ss);
    const rr = await fetch(ss).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Status not 200');
      }
    })
      .then((data) => {
        gState.metaSearchData = data;
        var keyNames = data[0] ? Object.keys(data[0]) : [];
        var columns: IColumn[] = [];
        keyNames.forEach(v => {
          addColumn(columns, v, v, 80);
        });
        setQuickSearchColumns(columns);
        setlocalQuickSearchData(data);
        setShowQuickSearch(true);
        // setShowReport(false);
      }
      );
    return '';
  }

  React.useEffect(() => {
    if (isShowTimer) {
      sysTimerMSecond = setTimeout(() => {
        settimerMSecond(timerMSecond + 1);
      }, 1);
      sysTimerSecond = setTimeout(() => {
        settimerSecond(timerSecond + 1);
      }, 1000);
    }
    if (!gState.isLoggedIn) {
      GetCodes();
      //////console.log('data xyz:',data,gState.currentTreeJson);
      QueryTopN();
      showTimer();
      reportColumns = loadAggColumns("language");
      gState.isLoggedIn = true;
    }
  });
  gState.groups = [
    {
      name: 'Phrase Pre-search',
      expandAriaLabel: 'Expand Queries section',
      collapseAriaLabel: 'Collapse Queries section',
      links: localAllSearchPhrase,
    }, {
      name: 'Pre-processed Reports',
      expandAriaLabel: 'Expand Queries section',
      collapseAriaLabel: 'Collapse Queries section',
      links: localPreprocessedReports,
    },
    {
      name: 'Analytic Search',
      expandAriaLabel: 'Expand Queries section',
      collapseAriaLabel: 'Collapse Queries section',
      links: localQueries,
    }, {
      name: 'Listener Search',
      expandAriaLabel: 'Expand Queries section',
      collapseAriaLabel: 'Collapse Queries section',
      links: localQueries,
    }];

  const showTimer = () => {
    settimerMSecond(0);
    settimerSecond(0);
    setisShowTimer(true);
  }
  const goClick = () => {
    setpageNum(0);
    showTimer();
    QueryTopN();
  }

  const onQuickSearchItem = (item?: any, index?: number, ev?: any) => {
    ////console.log('vvv', item);
    //setcurrentTranscript(item.fulltext);
    GetTranscriptsById(item.id);
  };
  const [startDate, setstartDate] = React.useState<Date | null | undefined>(null);
  const [endDate, setendDate] = React.useState<Date | null | undefined>(null);
  const [totalRecords, settotalRecords] = React.useState<number>(0);
  const [totalFiterRecords, settotalFiterRecords] = React.useState<number>(0);

  const onSelectEndDate = (date: Date | null | undefined): void => {
    setendDate(date);
    QueryTopN();
  };

  const clickMetaSearch = () => {
    dismissFilterPanel();
    FetchMetaSearch();
  }
  const [currentJsonSaveName, setcurrentJsonSaveName] = React.useState("");
  const clickSaveJsonToDB = () => {
    if (gState.currentTreeJsonRow) {//update
      UpdateJsonSearch(gState.currentTreeJsonRow.id
        , currentJsonSaveName, GetJsonSearch());
    } else {// add new
      AddJsonSearch(currentJsonSaveName, GetJsonSearch());
    }
  }
  const clickSaveFilterToDB = () => {
    if (gState.currentFilterRow) {//update
      ////console.log("gState.currentFilterRow.id", gState.currentFilterRow.id, gState.currentFilterRow);
      UpdateFilterSearch(gState.currentFilterRow.id, gState.currentFilterRow.tagId
        , currentFilterSaveName, GetFilterDetails());
    } else {// add new
      AddFilterSearch(currentFilterSaveName, GetFilterDetails());
    }
  }
  const clickSaveQueryToDB = () => {
    if (gState.currentQueryRow) {//update
      ////console.log("gState.clickSaveQueryToDB.id", gState.currentFilterRow.id, gState.currentFilterRow);
      UpdateQuery(gState.currentQueryRow.id
        , currentQuerySaveName, gState.currentFilterRow ? gState.currentFilterRow.id : -1, GetFilterForQuery()
        , gState.currentTreeJsonRow ? gState.currentTreeJsonRow.id : -1, GetJsonSearch(), startDate!, endDate!);
    } else {// add new
      AddQuery(currentQuerySaveName, gState.currentFilterRow ? gState.currentFilterRow.id : -1, GetFilterForQuery()
        , gState.currentTreeJsonRow ? gState.currentTreeJsonRow.id : -1, GetJsonSearch(), startDate!, endDate!);
    }
  }
  const clickAddNewFilter = () => {
    gState.currentFilterRow = null;
    setcurrentFilterSaveName("");
    setbgSelectedKeys([]);
  }
  const clickClearFilter = () => {
    gState.currentFilterRow = null;
    setcurrentSelectedFilterKey("");
    for (var i = 0; i < allSelectedKeys.length; i++) {
      allSelectedKeys[i] = [];
    }
    setallSelectedKeys(allSelectedKeys);
    //clear all filter's selection
    setcurrentFilterSaveName("");
    // setbgSelectedKeys([]);
    // //console.log("allSelectedKeys", allSelectedKeys);
    forceUpdate();
  }
  const [bgSelectedKeys, setbgSelectedKeys] = React.useState<string[]>([]);
  const [allSelectedKeys, setallSelectedKeys] = React.useState<string[][]>([]);
  const dropdownStyles: Partial<IDropdownStyles> = { dropdown: { width: 130 } };
  const onBusinessGroupChange = (event: any, item: any): void => {
    if (item) {
      setbgSelectedKeys(
        item.selected ? [...bgSelectedKeys, item.key as string] : bgSelectedKeys.filter(key => key !== item.key),
      );
    }
  };
  const onFilterChange = (event: any, item: any): void => {
    if (item) {
      setbgSelectedKeys(
        item.selected ? [...bgSelectedKeys, item.key as string] : bgSelectedKeys.filter(key => key !== item.key),
      );
    }
  };

  const onChangeOneFilterField = (codeTypeId: number, event: any, value: string): void => {
    if (value) {
      //console.log("onChangeOneFilterField[codeTypeId]", allSelectedKeys[codeTypeId]);
      if (!allSelectedKeys[codeTypeId]) allSelectedKeys[codeTypeId] = [""];
      //console.log("onChangeOneFilterField[codeTypeId] 222", allSelectedKeys[codeTypeId]);
      allSelectedKeys[codeTypeId] = [value, codeTypeId.toString()];
      setallSelectedKeys(allSelectedKeys);
      forceUpdate();
    }
  };
  const onFilterDropdownChange = (codeTypeId: number, event: any, item: any): void => {
    if (item) {
      //console.log("allSelectedKeys[codeTypeId]", allSelectedKeys[codeTypeId]);
      if (!allSelectedKeys[codeTypeId]) allSelectedKeys[codeTypeId] = [];
      //console.log("allSelectedKeys[codeTypeId] 222", allSelectedKeys[codeTypeId]);
      allSelectedKeys[codeTypeId] = item.selected ? [...allSelectedKeys[codeTypeId], item.key as string] : allSelectedKeys[codeTypeId].filter(key => key !== item.key);
      setallSelectedKeys(allSelectedKeys);
      forceUpdate();
    }
  };
  const [hideCodeEdit, sethideCodeEdit] = React.useState(true);
  const [isIncludeMeta, { toggle: toggleIncludeMeta }] = useBoolean(false);
  const [isQuickSearch, setisQuickSearch] = React.useState(false);
  const clickShowTree = () => {
    console.log('jjjj', gState.currentTreeJson);
    var j = GetJsonSearch();
    if (j == "" || j == "{}") setJsonAndState(TemplateJson, null);
    setTimeout(() => {
      dismissAnalystPanel();
    }, 70);
    setTimeout(() => {
      gState.isLoadedTree = false;

      openAnalystPanel();
    }, 500);
  }
  const onRefresh = () => {
    ////console.log("onRefresh 999");
    //clickShowTree();
    forceUpdate();
  };

  const [currentPanelType, setCurrentPanelType] = React.useState(PanelType.extraLarge);
  const metaPanelClick = () => {
    // cardWidth === CardWidthDefault ? setcardWidth(CardWidthLargeDefault) : setcardWidth(CardWidthDefault);
    currentPanelType === PanelType.extraLarge ? setCurrentPanelType(PanelType.smallFixedFar) : (currentPanelType === PanelType.smallFixedFar ? setCurrentPanelType(PanelType.largeFixed) : setCurrentPanelType(PanelType.extraLarge));
  }

  const menuDates: IContextualMenuProps = {
    items: [
      {
        key: '7',
        text: 'Last 7 days',
        iconProps: { iconName: 'Filter' },
        onClick: () => selectOneFrom(7)
      },
      {
        key: '30',
        text: 'Last 30 days',
        iconProps: { iconName: 'Filter' },
        onClick: () => selectOneFrom(30)
      },
      {
        key: '90',
        text: 'Last 90 days',
        iconProps: { iconName: 'Filter' },
        onClick: () => selectOneFrom(90)
      }
    ]
  };
  const menuFilters: IContextualMenuProps = {
    items: [
      {
        key: 'fLogmeinf',
        text: 'CSS surface',
        iconProps: { iconName: 'Filter' }
      },
      {
        key: 'fQuickAssistf',
        text: 'CSS XBOX',
        iconProps: { iconName: 'Filter' }
      }
    ]
  };

  const _farItems: ICommandBarItemProps[] = [
    {
      key: 'include',
      text: 'Include meta',
      // This needs an ariaLabel since it's icon-only
      ariaLabel: 'include',
      // iconOnly: true,
      iconProps: { iconName: isIncludeMeta ? 'CheckboxComposite' : 'Checkbox' },
      onClick: toggleIncludeMeta,
    },
  ];

  const [localQuickSearchText, setlocalQuickSearchText] = React.useState('');

  const onChangeSaveName = React.useCallback(
    (event: any, newValue?: string) => {
      setcurrentJsonSaveName(newValue ? newValue : '');
    },
    [],
  );

  const onChangeSaveFilterName = React.useCallback(
    (event: any, newValue?: string) => {
      setcurrentFilterSaveName(newValue ? newValue : '');
    },
    [],
  );
  const cancelFilterSpecified = () => {
    clickClearFilter();
  }
  const cancelJsonSpecified = () => {
    onFocusQuickSearch();
  }
  const cancelQuerySelected = () => {
    setcurrentQuerySaveName('');
    setcurrentSelectedQueryKey("");
    gState.currentQueryRow = null;
    setstartDate(null);
    setendDate(null);

    selectOneFilter(null);
    selectOneSearch(null);
    forceUpdate();
  }
  const onChangeSaveQueryName = React.useCallback(
    (event: any, newValue?: string) => {
      setcurrentQuerySaveName(newValue ? newValue : '');
    },
    [],
  );
  const onChangeQuickSearch = React.useCallback(
    (event: any, newValue?: string) => {
      setcurrentJsonSaveName("");
      setlocalQuickSearchText(newValue ? newValue : '');
      ////console.log("change quick text", newValue, 'local value', localQuickSearchText);
      setJsonAndState(getQuickSearchJsonString(newValue ? newValue : ''), null);
      ////console.log("change quick text 2", gState.currentTreeJson);
    },
    [],
  );
  const setJsonAndState = (jWithoutSquare: string, o: any) => {
    //////console.log("setJsonAndState", jWithoutSquare, o, gState.currentTreeJson);
    gState.currentTreeJson = JSON.parse("[" + jWithoutSquare + "]");
    //console.log("setJsonAndState 22", o);
    gState.currentTreeJsonRow = o;
    setcurrentSelectedJsonKey(o ? o.id : "");
    setcurrentJsonSaveName(o ? o.name : "");
    ////console.log("setJsonAndState", jWithoutSquare, o, gState.currentTreeJson);
  }
  const setFilterAndState = (o: any) => {
    gState.currentFilterRow = o;
    setcurrentSelectedFilterKey(o ? o.id : "");
    setcurrentFilterSaveName(o ? o.name : "");
    ////console.log("setJsonAndState", jWithoutSquare, o, gState.currentTreeJson);
  }
  const selectOneSearch = (o: any) => {
    setJsonAndState(o ? o.json : "", o);
    setisQuickSearch(false);
    // clickShowTree();
  }
  const selectOneQuery = (o: any) => {
    ////console.log("query",o,o.startDate);
    gState.currentQueryRow = o;
    setcurrentSelectedQueryKey(o ? o.id : "");
    var f = Fs.filter((item: any) => item.id == o.filterId);
    if (f && f[0]) selectOneFilter(f[0]);
    var s = Js.filter((item: any) => item.id == o.jId);
    ////console.log("s",s);
    if (s && s[0]) selectOneSearch(s[0]);
    setstartDate(new Date(o.startDate));
    setendDate(new Date(o.endDate));
    setcurrentQuerySaveName(o ? o.name : "");
  }
  const selectOneFilter = (o: any) => {
    setFilterAndState(o);
    var all: any[] = [];
    if (o) CodeTypes.forEach((x: any, i: number) => {
      var a = FilterDetails.filter((item: any) => item.filterId == o.id && item.codeTypeId == x.id);
      if (a.length > 0) {
        var ares = a[0].value.split(",");
        all[x.id] = ares;
      } else all[x.id] = [];
    });
    setallSelectedKeys(all);
  }
  const GetAllFiltersDropdown = () => {
    const listCodesDropdown: any[] = [];
    const listFieldsInput: any[] = [];
    CodeTypes.forEach((item: any, i: number) => {
      ////console.log("filtersss", item);
      if (item.dataType == "long") {
        var options: IDropdownOption[] = [];
        Codes.filter((o: any) => o.codeTypeId == item.id).map((oj: any, j: number) => {
          addOption(options, oj.codeTypeId + "." + oj.id, oj.name);
        });
        const r = Codes.filter((o: any) => o.codeTypeId == item.id).map((entry: any) => {
          return {
            key: entry.codeTypeId.toString() + "." + entry.id.toString(),
            text: entry.name
          };
        })

        listCodesDropdown.push(
          <Dropdown style={{ width: 500 }}
            key={'rr' + item.id.toString() + "." + item.id}
            placeHolder={"Select " + item.name}
            selectedKeys={allSelectedKeys[item.id]}
            onChange={(e: any, i: any) => onFilterDropdownChange(item.id, e, i)}
            multiSelect
            options={r}
            styles={dropdownStyles}
          />
        );
      }
      else if (item.dataType == "string") {
        listFieldsInput.push(
          <TextField styles={{
            root: {
              minWidth: '200px'
            }
          }}
            key={item.id}
            placeholder={"Enter " + item.name}
            underlined onChange={(event: any, newValue?: string) =>
              onChangeOneFilterField(item.id, event, newValue ? newValue : "")}
            value={allSelectedKeys[item.id] ? allSelectedKeys[item.id][0] : ""}
          />
        );
      }
    }
    );

    return <Stack grow horizontal horizontalAlign="space-between"><Stack>{listCodesDropdown}</Stack>&nbsp;&nbsp;&nbsp;&nbsp;<Stack>{listFieldsInput}</Stack></Stack>;
  }
  const onFocusQuickSearch = () => {
    setcurrentJsonSaveName("");
    setJsonAndState(localQuickSearchText ? getQuickSearchJsonString(localQuickSearchText) : "{}", null);//TemplateJson
    setisQuickSearch(true);
  }
  const [isMsgCollapsed, setisMsgCollapsed] = React.useState(true);
  const [showFilterSaved, setshowFilterSaved] = React.useState(false);
  const [showQuerySaved, setshowQuerySaved] = React.useState(false);
  const [showTranscriptSearchSaved, setshowTranscriptSearchSaved] = React.useState(false);
  const [currentFilterSaveName, setcurrentFilterSaveName] = React.useState("");
  const [currentQuerySaveName, setcurrentQuerySaveName] = React.useState("");
  const [currentSelectedFilterKey, setcurrentSelectedFilterKey] = React.useState("");
  const [currentSelectedJsonKey, setcurrentSelectedJsonKey] = React.useState("");
  const [currentSelectedQueryKey, setcurrentSelectedQueryKey] = React.useState("");
  const [pageNum, setpageNum] = React.useState(0);
  const overflowButtonProps: IButtonProps = { ariaLabel: 'More commands' };
  const topBarItems: ICommandBarItemProps[] = [
    {
      key: 'newItem',
      text: 'Complex Call Analysis',
      split: true,
      ariaLabel: 'New'
    },
    // {
    //   key: 'upload',
    //   text: 'Upload',
    //   // iconProps: { iconName: 'Upload' },
    //   split: true,
    //   disabled: true,
    //   href: 'https://developer.microsoft.com/en-us/fluentui'
    // }
  ];
  const selectOneFrom = (preDays: number) => {
    var d = new Date();
    d.setDate(d.getDate() - preDays);
    setstartDate(d);
  }
  return (

    <Stack grow styles={{
      root: {
        minHeight: '1024px',
        backgroundImage: `url('https://www.wallpaperflare.com/static/514/453/199/reflections-waves-lines-bright-wallpaper.jpg')`,
      }
    }}>
      <StackItem styles={{
        root: {
          height: '42px', padding: '1px'
        }
      }}>
        {/* <CommandBar styles={{
        root: {
          height: '42px', padding: '1px',backgroundColor: '#0078d4'
        }
      }}
            items={topBarItems}
           overflowButtonProps={overflowButtonProps}
            ariaLabel="Use left and right arrow keys to navigate between commands"
          /> */}
        <Stack grow horizontal horizontalAlign="space-between" verticalAlign="center" styles={{
          root: {
            padding: '1px',

            maxHeight: '42px'
          }
        }}>
          <Stack grow horizontal verticalAlign="center" >
            <Image width={125}
              src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31"
              alt="Example with no image fit value and no height or width is specified."
            />
            <FontIcon iconName={'Separator'} style={{ fontSize: "26px", fontWeight: "bold", color: "darkblue" }} />
            <span style={{ fontFamily: "Segoe UI", fontSize: "20px", color: "darkblue" }}>Call Analysis</span>
            <FontIcon iconName={'Separator'} style={{ fontSize: "26px", fontWeight: "bold", color: "darkblue" }} />
            <span style={{ fontWeight: "bold", fontStyle: "italic", fontSize: "16px", color: "darkblue" }}>LightSpeed&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
            {/* <Image width={125} height={32}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzCxoYXwwWPBf3cd7vN-8WkhecNmlNfvSB4Q&usqp=CAU"
            alt="Example with no image fit value and no height or width is specified."
          />           */}
          </Stack>
          <Stack grow horizontal horizontalAlign="end" verticalAlign="center" styles={{
            root: {
              maxWidth: '924px'
            }
          }}>
            {!isMsgCollapsed && GetFilterForQuery() != "" ? FilterMessage() : ""}
            {!isMsgCollapsed && GetJsonSearch() != "" ? JsonSearchMessage() : ""}
            <TooltipHost
              content="Hide/Show current search condition"
              id={tpClearAllMeta}
            >
              <FontIcon onClick={() => setisMsgCollapsed(!isMsgCollapsed)} iconName={isMsgCollapsed ? 'ChevronLeft' : 'ChevronRight'} />
            </TooltipHost>
          </Stack>
        </Stack>
      </StackItem>
      <StackItem>
        <Stack grow horizontal horizontalAlign='stretch' verticalAlign="center" styles={{
          root: {
            padding: '1px'
          }
        }}>
          <StackItem grow>
            <Stack grow horizontal horizontalAlign='center'>
              <StackItem styles={{
                root: {
                  minWidth: '1024px',
                  backgroundColor: 'transparent'
                }
              }}>
                <Stack grow horizontal horizontalAlign='stretch' verticalAlign="center" >
                  <TooltipHost
                    content="Select last 7/30/90 days"
                    id={tpClearAllMeta}
                  >
                    <CommandBarButton styles={{
                      root: {
                        width: '50px',
                        backgroundColor: 'transparent'
                      }
                    }}
                      text="From:"
                      split
                      splitButtonAriaLabel="See 2 options"
                      aria-roledescription="split button"
                      menuProps={menuDates}
                    />
                  </TooltipHost>&nbsp;
                  <DatePicker styles={{ root: { width: '140px' } }} placeholder={"From date"}
                    ariaLabel={"From date"}
                    allowTextInput={true} value={startDate!}
                    onSelectDate={(d: any) => setstartDate(d)} />
                  &nbsp;
                  <DatePicker styles={{ root: { width: '140px' } }} placeholder={"End date"}
                    ariaLabel={"Select end date"}
                    allowTextInput={true}
                    value={endDate!}
                    onSelectDate={onSelectEndDate} />&nbsp;
                  <TooltipHost
                    content="Select saved meta filter"
                    id={tpClearAllMeta}
                  >
                    <Dropdown placeholder="Filter:" styles={{
                      root: {
                        backgroundColor: 'transparent',
                        minWidth: "80px"
                      }
                    }}
                      options={Filters}
                      selectedKey={currentSelectedFilterKey}
                      // onSelectCapture={()=> {//console.log("onSelect",isFilterOpen); setFilterOpen(true)}}
                      onChange={(a: any, o?: any, index?: number) => selectOneFilter(o.value)}
                    />
                  </TooltipHost>
                  <Stack verticalAlign="end">
                    <TooltipHost
                      content="Edit/Add meta filter"
                      id={tpClearAllMeta}
                    >
                      <FontIcon onClick={() => setFilterOpen(true)} iconName={'Edit'} style={{ color: "lightblue" }} />
                    </TooltipHost>
                    <TooltipHost
                      content="Clear filter"
                      id={tpClearAllMeta}
                    >
                      <FontIcon iconName="Cancel" onClick={() => cancelFilterSpecified()} style={{ color: "red" }} />
                    </TooltipHost>
                  </Stack>&nbsp;
                  <Separator vertical styles={{ root: { margin: '8px' } }}></Separator>
                  <TooltipHost
                    content="Select saved transcript search"
                    id={tpClearAllMeta}
                  >
                    <Dropdown placeholder="Call Text:" styles={{
                      root: {
                        backgroundColor: 'transparent',
                        minWidth: "80px"
                      }, dropdown: { backgroundColor: 'transparent' }
                    }}
                      options={JSearches}
                      selectedKey={currentSelectedJsonKey}
                      onChange={(a: any, o?: any, index?: number) => selectOneSearch(o.value)}
                    />
                  </TooltipHost>&nbsp;
                  <TextField style={{ backgroundColor: 'lightblue' }} styles={{
                    root: {
                      minWidth: '300px'
                    }
                  }}
                    placeholder="Click to do quick search"
                    onFocus={() => onFocusQuickSearch()}
                    underlined onChange={(event: any, newValue?: string) =>
                      onChangeQuickSearch(event, newValue)}
                    value={localQuickSearchText}
                  />
                  <Stack verticalAlign="end">
                    <TooltipHost
                      content="Edit/Add transcript search"
                      id={tpClearAllMeta}
                    >
                      <FontIcon onClick={() => clickShowTree()} iconName={'Edit'} style={{ color: "lightblue" }} />
                    </TooltipHost>
                    <TooltipHost
                      content="Clear transcript search"
                      id={tpClearAllMeta}
                    >
                      <FontIcon iconName="Cancel" onClick={() => cancelJsonSpecified()} style={{ color: "red" }} />
                    </TooltipHost>
                  </Stack>&nbsp;
                  <Separator vertical styles={{ root: { margin: '8px' } }}></Separator>
                  <StackItem grow>
                    <Stack grow horizontal horizontalAlign='end'>
                      <TooltipHost
                        content="Select saved query"
                        id={tpClearAllMeta}
                      >
                        <Dropdown placeholder="Select Query" styles={{
                          root: {
                            backgroundColor: 'transparent',
                            minWidth: "80px"
                          }, dropdown: { backgroundColor: 'transparent' }
                        }}
                          options={Queries}
                          selectedKey={currentSelectedQueryKey}
                          onChange={(a: any, o?: any, index?: number) => selectOneQuery(o.value)}
                        />
                      </TooltipHost>

                      <TooltipHost
                        content="Edit/Add query name"
                        id={tpClearAllMeta}
                      >
                        <TextField style={{ backgroundColor: 'lightblue' }} styles={{
                          root: {
                            width: '80px'
                          }
                        }}
                          placeholder={currentQuerySaveName}
                          onFocus={() => onFocusQuickSearch()}
                          underlined onChange={(event: any, newValue?: string) =>
                            onChangeSaveQueryName(event, newValue)}
                        //value={currentQuerySaveName}
                        /></TooltipHost>
                      <Stack>                      <TooltipHost
                        content="Save/Add query with current setting"
                        id={tpClearAllMeta}
                      >
                        <FontIcon onClick={() => clickSaveQueryToDB()} iconName={'Save'} style={{ color: "lightblue" }} />
                      </TooltipHost>
                        <TooltipHost
                          content="Clear selected query"
                          id={tpClearAllMeta}
                        >
                          <FontIcon iconName="Cancel" onClick={() => cancelQuerySelected()} style={{ color: "red" }} />
                        </TooltipHost>
                      </Stack>

                      {showQuerySaved && <MessageBar
                        messageBarType={MessageBarType.success}
                        isMultiline={false}
                        dismissButtonAriaLabel="Close">Saved!</MessageBar>}
                    </Stack>
                  </StackItem>

                </Stack>

                <Stack grow horizontal horizontalAlign='space-evenly' verticalAlign='center'>
                  <TooltipHost
                    content="Search with current condition"
                    id={tpClearAllMeta}
                  >
                    <DefaultButton primary style={{ fontSize: '16px' }} iconProps={{ iconName: 'FastForward' }} text="Go" onClick={() => goClick()} />
                  </TooltipHost>
                  <label>{timerSecond}.{timerMSecond}</label>
                  <span>By filter:&nbsp;{totalFiterRecords} &nbsp;</span>
                  <span>Total:&nbsp;{totalRecords} &nbsp;</span>
                  <StackItem >
                    <Stack horizontal horizontalAlign="start" verticalAlign='center' >
                      <span>To page:</span>
                      {/* <StackItem> */}
                      <Slider styles={{
                        root: {
                          width: '180px'
                        }
                      }}
                        min={1}
                        max={Math.ceil(totalRecords / limit)}
                        step={1}
                        value={pageNum}
                        showValue={true}
                        onChanged={(e: any, value: number) => { setpageNum(value); showTimer(); Query(value) }}
                      />
                      {/* </StackItem> */}
                      <label>/{Math.ceil(totalRecords / limit)}pages</label>
                    </Stack>
                  </StackItem>
                  <StackItem >
                    <Stack horizontal horizontalAlign="end" verticalAlign='center' >
                      <span>Rows/page:</span>
                      <Slider styles={{
                        root: {
                          width: '180px'
                        }
                      }}
                        min={1}
                        max={1000}
                        step={1}
                        defaultValue={10}
                        showValue={true}
                        onChanged={(e: any, value: number) => setlimit(value)}
                      />
                      {/* <Label>Max 1000/page</Label> */}
                    </Stack>
                  </StackItem>
                </Stack>
              </StackItem>
            </Stack>
          </StackItem>
        </Stack>
      </StackItem>
      <StackItem>
        <Stack grow horizontal verticalAlign="start">
          <Stack grow id='main'
            horizontalAlign="start"
            verticalAlign="start"
            verticalFill
            styles={{
              root: {
                width: '2048px',
                margin: '0 0',
                textAlign: 'center',
                color: 'red',
                minHeight: '1024px',
                backgroundColor: 'transparent'
              }
            }}
          // gap={15}
          >
            {/* <div id="treeWrapper" style={{ width: '2048px', height: '1024px' }}>
            <Tree data={orgChart}         rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"/>
          </div> */}

            {ShowQuickSearch && <DetailsList styles={{ root: { width: '2048px' } }}
              // componentRef={this._root}
              items={localQuickSearchData}
              setKey="none"
              selectionMode={1}
              // groups={gState.groups}
              columns={QuickSearchColumns}
              ariaLabelForSelectAllCheckbox="Toggle selection for all items"
              ariaLabelForSelectionColumn="Toggle selection"
              checkButtonAriaLabel="Row checkbox"
              onActiveItemChanged={onQuickSearchItem}
              // onRenderDetailsHeader={this._onRenderDetailsHeader}
              // onRenderItemColumn={(item, index, col) =>
              //   RenderCell(item, index, col)
              // }
              // onRenderItemColumn={this._onRenderColumn}
              compact={true}
            />}
            <Panel
              isOpen={isFilterOpen}
              isLightDismiss={true}
              onDismiss={dismissFilterPanel}
              type={currentPanelType}
              headerText="Call analysis - Meta data filter"
              closeButtonAriaLabel="Close"
            >
              <Stack grow horizontal verticalAlign="start" horizontalAlign='start'>
                <Stack.Item className={verticalStyle} >
                  <Separator vertical>
                    <Stack grow verticalAlign='space-between' styles={{
                      root: {
                        minHeight: '350px',
                      }
                    }}>
                      {/* <TooltipHost
                        content="Search"
                        id={tpSearch}
                      >
                        <FontIcon iconName={'Search'} onClick={clickMetaSearch} className={classNames.deepSkyBlue} ></FontIcon>
                      </TooltipHost> */}
                      <TooltipHost
                        content="Clear to add new filter"
                        id={tpClearAllMeta}
                      >
                        <FontIcon iconName={'Squalls'} onClick={clickClearFilter} className={classNames.deepSkyBlue} ></FontIcon>
                      </TooltipHost>
                      <TooltipHost
                        content="Save"
                        id={tpSave}
                      >
                        <FontIcon iconName={'save'} className={classNames.red} onClick={clickSaveFilterToDB}></FontIcon>
                      </TooltipHost>
                      {/* <FontIcon iconName={cardWidth === CardWidthDefault ? "DoubleChevronLeftMedMirrored" : "DoubleChevronLeftMed"} onClick={metaPanelClick}
                        className={classNames.deepSkyBlue} /> */}
                      <FontIcon iconName="SingleColumnEdit" className={classNames.deepSkyBlue}
                        onClick={() => sethideCodeEdit(!hideCodeEdit)} />
                      <FontIcon iconName="Cancel" onClick={dismissFilterPanel} className={classNames.deepSkyBlue} />
                    </Stack>
                  </Separator>
                </Stack.Item>
                <StackItem grow >
                  <Stack verticalFill verticalAlign='space-between' horizontalAlign='start'>
                    <StackItem grow styles={{
                      root: {
                        minHeight: '400px',
                        maxWidth: '600px',
                        width: '550px'
                      }
                    }}>
                      <Stack grow horizontal verticalAlign="center" horizontalAlign='start'>
                        <label style={{ fontWeight: "bold", fontSize: "18px", color: "darkblue" }}>Filter Name:</label>
                        <TextField style={{ fontSize: "18px", color: "darkblue" }} styles={{
                          root: {
                            width: '250px'
                          }
                        }}
                          placeholder="Enter filter name"
                          underlined onChange={(event: any, newValue?: string) =>
                            onChangeSaveFilterName(event, newValue)}
                          value={currentFilterSaveName}
                        />
                        <TooltipHost
                          content="Clear to add new filter"
                          id={tpCleatFilterName}
                        >
                          <FontIcon iconName={'ClearSelection'} onClick={clickClearFilter} style={{ fontWeight: "bold", fontSize: "18px", color: "darkblue" }} ></FontIcon>
                        </TooltipHost>
                      </Stack>
                      {showFilterSaved && <MessageBar
                        messageBarType={MessageBarType.success}
                        isMultiline={false}
                        dismissButtonAriaLabel="Close">Filter saved!</MessageBar>}
                      {!hideCodeEdit && <StackItem>
                        <TextField multiline rows={8} autoAdjustHeight value={GetFilterForQuery()} />
                      </StackItem>}
                      {/* <Dropdown style={{ width: 500 }}
                        placeHolder="(not specified)"
                        selectedKeys={bgSelectedKeys}
                        onChange={onBusinessGroupChange}
                        multiSelect
                        options={businesGroupList}
                        styles={dropdownStyles}
                      /> */}
                      {GetAllFiltersDropdown()}
                    </StackItem>
                  </Stack>
                </StackItem>
              </Stack>
            </Panel>
            <Panel
              isOpen={isAnalystOpen}
              isLightDismiss={true}
              onDismiss={dismissAnalystPanel}
              type={currentPanelType}
              headerText="Call analysis - Analyst Transcript Search"
              closeButtonAriaLabel="Close"
            >
              <Stack grow horizontal verticalAlign="start" horizontalAlign='start'>
                <Stack.Item className={verticalStyle} >
                  <Separator vertical>
                    <Stack grow verticalAlign='space-between' styles={{
                      root: {
                        minHeight: '350px',
                      }
                    }}>
                      {/* <TooltipHost
                        content="Search"
                        id={tpSearch}
                      >
                        <FontIcon iconName={'Search'} onClick={clickSearch} className={classNames.deepSkyBlue} ></FontIcon>
                      </TooltipHost> */}
                      <TooltipHost
                        content="Clear All"
                        id={tpSave}
                      >
                        <FontIcon iconName={'delete'} onClick={() => onFocusQuickSearch()} className={classNames.deepSkyBlue} ></FontIcon>
                      </TooltipHost>
                      <TooltipHost
                        content="Save"
                        id={tpSave}
                      >
                        <FontIcon iconName={'save'} className={classNames.darkgreen} onClick={clickSaveJsonToDB}></FontIcon>
                      </TooltipHost>
                      {/* <FontIcon iconName={cardWidth === CardWidthDefault ? "DoubleChevronLeftMedMirrored" : "DoubleChevronLeftMed"} onClick={metaPanelClick}
                        className={classNames.deepSkyBlue} /> */}
                      <FontIcon iconName="SingleColumnEdit" className={classNames.deepSkyBlue} onClick={() => sethideCodeEdit(!hideCodeEdit)} />
                      <FontIcon iconName="Cancel" onClick={dismissAnalystPanel} className={classNames.deepSkyBlue} />
                    </Stack>
                  </Separator>
                </Stack.Item>
                <StackItem grow >
                  <Stack grow>
                    <Stack grow horizontal verticalAlign="center" horizontalAlign='start'>
                      <label style={{ fontWeight: "bold", fontSize: "18px", color: "darkblue" }}>Transcript Search Name:</label>
                      <TextField style={{ fontSize: "18px", color: "darkblue" }} styles={{
                        root: {
                          width: '250px'
                        }
                      }}
                        placeholder="Enter transcript search name"
                        underlined onChange={(event: any, newValue?: string) =>
                          onChangeSaveName(event, newValue)}
                        value={currentJsonSaveName}
                      />
                    </Stack>
                    {showTranscriptSearchSaved && <MessageBar
                      messageBarType={MessageBarType.success}
                      isMultiline={false}
                      dismissButtonAriaLabel="Close">Transcript search saved!</MessageBar>}
                    {!hideCodeEdit && <StackItem>
                      <TextField multiline rows={8} autoAdjustHeight value={GetJsonSearch()} />
                    </StackItem>}
                    <StackItem grow styles={{
                      root: {
                        minWidth: '2000px',
                        minHeight: '2000px'
                      }
                    }}>

                      {/* <Tree data={orgChart} /> */}
                      <TranscriptTree data={gState.currentTreeJson} path={""} treeOperator={gState.currentTreeJson[0] ? gState.currentTreeJson[0].operator : "or"} onRefresh={onRefresh} />
                    </StackItem>
                  </Stack>
                </StackItem>
              </Stack>
            </Panel>
            <Panel
              isLightDismiss
              isOpen={isTranscriptOpen}
              onDismiss={dismissTranscriptPanel}
              closeButtonAriaLabel="Close"
              headerText="Transcript and Audio"
            >
              <FontIcon style={{ fontWeight: "bold", fontSize: "36px", color: "darkblue" }} iconName={'play'} />
              <Stack>{currentTranscript.map((x: any, j: number) => {
                return j % 2 == 0 ? <Label>{x}</Label> :
                  <Label disabled>{x}</Label>
              })}</Stack>
            </Panel>

          </Stack>
        </Stack>
      </StackItem>
    </Stack>
  );

});
