import { Toggle } from '@fluentui/react/lib/Toggle';
import { CommandBar, ICommandBarItemProps } from '@fluentui/react/lib/CommandBar';
import { TooltipHost, ITooltipHostStyles } from '@fluentui/react/lib/Tooltip';
import { useId } from '@fluentui/react-hooks';
import { Image } from '@fluentui/react/lib/Image';
import { Checkbox } from '@fluentui/react/lib/Checkbox';
// import { Toggle } from '@fluentui/react/lib/Toggle';
import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react/lib/ChoiceGroup';

import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
// import { DetailsRow } from '@fluentui/react/lib/DetailsList';
// import { Selection, SelectionMode, SelectionZone } from '@fluentui/react/lib/Selection';
import { getTheme, IRawStyle } from '@fluentui/react/lib/Styling';
import { GroupedList, IGroupHeaderProps, IGroupFooterProps } from '@fluentui/react/lib/GroupedList';

import { Dropdown, DropdownMenuItemType, IDropdownOption, IDropdownStyles } from '@fluentui/react/lib/Dropdown';
import { DatePicker, DayOfWeek, IDatePickerStrings } from '@fluentui/react/lib/DatePicker';
import { Card, ICardTokens, ICardSectionStyles, ICardSectionTokens } from '@fluentui/react-cards';
// import { TeachingBubble } from '@fluentui/react/lib/TeachingBubble';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import * as React from 'react';

import { DefaultButton, PrimaryButton, ActionButton } from '@fluentui/react/lib/Button';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { Separator } from '@fluentui/react/lib/Separator';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { useConstCallback } from '@fluentui/react-hooks';
import { Nav, INavStyles, INavLinkGroup, } from '@fluentui/react/lib/Nav';
import { FontIcon } from '@fluentui/react/lib/Icon';
import { mergeStyles, mergeStyleSets } from '@fluentui/react/lib/Styling';
// import { Slider } from '@fluentui/react/lib/Slider';

import General from './stores/general';
import { useBoolean } from '@fluentui/react-hooks';
import {
  Stack
} from '@fluentui/react/lib/Stack'; // StackItem,  Link, FontWeights, DetailsList, SpinButton,
// IColumn, ITextStyles, IIconStyles, IIconProps, IStackTokens, 
import { Label } from '@fluentui/react/lib/Label';
import { Text } from '@fluentui/react/lib/Text';
import { TexFontWeightst } from '@fluentui/react/lib/FontWeights';
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
    // verticalAlign: 'top',
    background: 'none',
    backgroundColor: 'transparent',
    border: 'none',
    paddingLeft: 32,
  },
});
const operatorOptions: IDropdownOption[] = [
  //and,or,andnot,proximity
  { key: 'and', text: 'AND' },
  { key: 'or', text: 'OR' },
  { key: 'proximity', text: 'Proximity' },
  { key: 'andnot', text: 'AND NOT' }
];
const setJsonByPath = (obj: any, path: any, value: any): any => {
  let properties = Array.isArray(path) ? path : path.split(".");
  //console.log('setJsonByPath', obj, path,value,properties);
  var x = obj[0] ? obj[0] : obj;

  //////console.log('setJsonByPath 22',obj[0]![properties[0]]);
  if (properties.length > 1) {
    //process first element, find node number, then pass to this function from child node
    if (properties[0].indexOf("(") > 0) {
      var i = properties[0].substring(properties[0].indexOf("(") + 1, properties[0].indexOf(")"));
      var attributeName = properties[0].substring(0, properties[0].indexOf("("));

      //console.log('test 00', i, properties[0], properties[0].indexOf("("), attributeName)
      ////console.log('test aa ', properties[0], value, x[attributeName]);//,obj[attributeName][0],obj[attributeName][i]
      //console.log("test bb", x[attributeName][i], properties.slice(1), value);
      //if (!obj[0].hasOwnProperty(properties[0]) || typeof obj[0][properties[0]] !== "object") obj[0][properties[0]] = [{}];
      setJsonByPath(x[attributeName][i], properties.slice(1), value)
    } else if (properties[0] == "groupLinkNext") {
      //console.log('test 11',properties[0]);
      if (x[properties[0]]) x[properties[0]][properties[1]] = value;
      else {
        switch (properties[1]) {
          case "interval":
            x[properties[0]] = { interval: value };
            break;
          case "isNotWithin":
            x[properties[0]] = { isNotWithin: value };
          default:
            break;
        }

      }
    }
  } else {
    //console.log('test cc', properties[0], value, x[properties[0]]);
    ////console.log('test dd', x[path], value);
    x[properties[0]] = value;
  }
}
const setJsonNodeByPath = (obj: any, path: any, value: any): any => {
  let properties = Array.isArray(path) ? path : path.split(".");
  ////console.log('setJsonNodeByPath',properties,path, obj, obj[0]);
  var x = obj[0] ? obj[0] : obj;
  if (properties.length > 1) {
    //process first element, find node number, then pass to this function from child node
    if (properties[0].indexOf("(") > 0) {
      var i = properties[0].substring(properties[0].indexOf("(") + 1, properties[0].indexOf(")"));
      var attributeName = properties[0].substring(0, properties[0].indexOf("("));
      ////console.log("test bb", x[attributeName][i], properties.slice(1), value);
      //if (!obj[0].hasOwnProperty(properties[0]) || typeof obj[0][properties[0]] !== "object") obj[0][properties[0]] = [{}];
      setJsonNodeByPath(x[attributeName][i], properties.slice(1), value)
    }
  } else {
    if (properties[0].indexOf("(") > 0) {
      var i = properties[0].substring(properties[0].indexOf("(") + 1, properties[0].indexOf(")"));
      var nodename = properties[0].substring(0, properties[0].indexOf("("));
      ////console.log("test 2bb", x[nodename][i]);
      if (x[nodename].length < 2 && value == "") x[nodename] = value;
      else x[nodename][i] = value;
    } else {
      x[properties[0]] = value;
    }
  }
}
const getJsonAttributevalueByPath = (obj: any, path: any): string => {
  let properties = Array.isArray(path) ? path : path.split(".");
  if (properties.length > 1) {
    if (!obj.hasOwnProperty(properties[0]) || typeof obj[properties[0]] !== "object") obj[properties[0]] = {}
    return getJsonAttributevalueByPath(obj[properties[0]], properties.slice(1))
  } else {
    //////console.log('test properties[0]', properties[0], obj[properties[0]]);
    if (typeof obj[properties[0]] === 'string')
      return obj[properties[0]];
    else return JSON.stringify(obj[properties[0]]);
  }
}

export interface ITreeProps {
  data: any;
  path: string;
  treeOperator: string,
  onRefresh: () => void;
}
// export interface ISearchProps {
//   search: Search;
//   onRefreshSearch: () => void;
// }
// export interface Phrase {
//   phrase:string,channel:number,fuzzy:number,from?:number, end?:number
// }
// export interface GroupLink //Support 1 to 2, 2 to 3, 3 to 4. 3 groups will have 2 links
// {
//   LinkType?: number; //0 interval seconds, 1 interval words
//   Interval?: number;
//   IsSequence?: boolean;
//   IsNotWithin?: boolean;
//   NotWithinNeedBoth?: boolean;
// }
// export interface PhraseGroup {
//   phrases:Phrase[],groupLink?:GroupLink
// }
// export interface Search {
//   operator:string, phraseGroups:PhraseGroup[],subSearches?:Search[]
// }
export const TranscriptTree: React.FunctionComponent<ITreeProps> = ({ data, path, treeOperator, onRefresh }) => {
  const gState = React.useContext(General);
  //console.log("my func", path, treeOperator);
  var treeJsonArray = data;//Array.isArray(data)?data: any [].push(data);//
  //////console.log("my func",data, onRefresh)
  // const [currentOperator, setcurrentOperator] = React.useState("or");
  // const [isBlur,setisBlur] = React.useState(false);
  React.useEffect(() => {
    if (!gState.isLoadedTree) {
      //settreeJsonArray(gState.currentTreeJson);

      //////console.log("xxx99aa",treeJsonArray,gState.currentTreeJson);
      gState.isLoadedTree = true;
    }
  }
  );

  const onOperatorSelectChange = (path: string, a: any, o?: any, index?: number) => {
    //////console.log("onOperatorSelectChange",path, o.key); 
    //setcurrentOperator(o.key);
    if (path) setJsonByPath(gState.currentTreeJson, path, o.key);
    //console.log('new json', path, o, gState.currentTreeJson, gState.currentTreeJson);
    onRefresh();//DO NOT DELETE !!!!! We can use this one refresh tree
  }
  const showExpand = (s: string): boolean => {
    if (s.indexOf('Phrase(') > -1 || s.indexOf('AND') > -1 || s.indexOf('OR') > -1 || s.indexOf('NOT') > -1 || s.indexOf('Proximity') > -1) return false;
    return true;
  }
  const clickCURD = (key: string, action: string) => {
    key = key.replace(".operator", "").replace("operator", "");
    ////console.log('key', key, action);
    //////console.log('before change :', gJson)
    if (action === 'delete') {
      setJsonNodeByPath(gState.currentTreeJson, key, "");
      ////console.log('delete node res',gState.currentTreeJson);
    } else {//add
      if (!key) //root add
      {
        setJsonNodeByPath(gState.currentTreeJson, "phraseGroups",
          [{ phrases: [{ text: "input your text with comma sperated", channel: 0, fuzzy: 0 }] }]);
        setJsonNodeByPath(gState.currentTreeJson, "subSearches",
          [{ operator: "and", phraseGroups: [{ phrases: [{ text: "input your text with comma sperated", channel: 0, fuzzy: 0 }] }] }]);
      } else {
        var apath = key.split('.');
        var lastPart = apath.length > 0 ? apath[apath.length - 1] : "";
        if (lastPart.indexOf("(") > 0) {
          var i = lastPart.substring(lastPart.indexOf("(") + 1, lastPart.indexOf(")"));
          var nodeName = lastPart.substring(0, lastPart.indexOf("("));
          var newLastPart = lastPart.substring(0, lastPart.indexOf("(") + 1)
            + (parseInt(i) + 1).toString()
            + ")";
          ////console.log('old new last part',nodeName,lastPart,newLastPart);
          apath[apath.length - 1] = newLastPart;
          var newKey = apath.join('.');
          ////console.log('old new key',key,newKey);
          switch (nodeName) {
            case "phraseGroups":
              setJsonNodeByPath(gState.currentTreeJson, newKey,
                { phrases: [{ text: "input your text with comma sperated", channel: 0, fuzzy: 0 }] });
              break;
            case "subSearches":
              setJsonNodeByPath(gState.currentTreeJson, newKey,
                { operator: "and", phraseGroups: [{ phrases: [{ text: "input your text with comma sperated", channel: 0, fuzzy: 0 }] }] });
              break;
            case "phrases":
              setJsonNodeByPath(gState.currentTreeJson, newKey,
                { text: "input your text with comma sperated", channel: 0, fuzzy: 0 });
              break;
            default:
              break;
          }
        }
      }
    }
    onRefresh();
    //////console.log('after change :', JSON.stringify(gJson));
    //props.onToggleCollapse!(props.group!);
  };
  const onRenderHeader = (props: any): any => {
    //console.log("onRenderHeader 2x2x", props.group,props.group!.name);
    if (props.group!.name === undefined) return;
    // if (props.group!.key == "operator") setcurrentOperator(props.group!.name);
    // if (props.group.key === 'operator') setTreeRootProp(props);
    const toggleCollapse = (): void => {
      props.onToggleCollapse!(props.group!);
    };
    //////console.log('props.group!.name', props.group!.name);
    const isShowExpand = showExpand(props.group!.name);

    return (
      <div style={{ fontWeight: "bold", fontSize: "20px" }}>
        {!isShowExpand && <FontIcon />}
        {isShowExpand &&
          <Stack horizontal verticalAlign="center">
            {props.group!.name.indexOf("Group") < 0 &&
              <FontIcon onClick={toggleCollapse} iconName={props.group!.isCollapsed ? 'CircleAddition' : 'Blocked2'} />}
            {props.group!.name.indexOf("Group") > -1 &&
              props.group!.key.indexOf("_0") < 0 ?
              <FontIcon style={{ fontSize: "26px" }} iconName={'Separator'} className={classNames.deepSkyBlue} />
              :
              <FontIcon style={{ fontSize: "26px" }} iconName={'Childof'} className={classNames.deepSkyBlue} />
            }
            {props.group!.name.indexOf("Group") > -1 &&
              <label style={{ fontWeight: "bold", fontSize: "16px", color: "green" }}>&nbsp;&nbsp;  {props.group!.name}</label>}
            {props.group!.name.indexOf("Group") < 0 &&
              <Dropdown style={{ fontWeight: "bold", fontSize: "18px", color: "blue", minWidth: "100px" }}
                placeholder={props.group!.name}
                //selectedKey={props.group!.name}
                options={operatorOptions}
                // styles={dropdownStyles}
                onChange={(a: any, o?: any, index?: number) => onOperatorSelectChange(props.group!.key, a, o, index)}
              />}
            &nbsp;&nbsp;
           {props.group!.key != "operator" && <FontIcon style={{ fontWeight: "bold", fontSize: "12px" }} onClick={() => clickCURD(props.group!.key, 'delete')} iconName={'Cancel'} className={classNames.red} />}
            {/* <FontIcon style={{ fontWeight: "bold", fontSize: "12px" }} onClick={() => clickCURD(props.group!.key, 'edit')} iconName={'Edit'} className={classNames.deepSkyBlue} /> */}
            <FontIcon style={{ fontWeight: "bold", fontSize: "12px" }} onClick={() => clickCURD(props.group!.key, 'add')}
              iconName={'Add'} className={classNames.darkgreen} />
          </Stack>
        }
      </div>
    );
  };
  const groupedListProps = {
    onRenderHeader,
    showEmptyGroups: true
    // onRenderFooter
  };
  const channelOptions: IDropdownOption[] = [
    { key: '0', text: 'Agent' },
    { key: '1', text: 'Customer' },
    { key: '2', text: 'All' }
  ];
  const GetChannelName = (key: string) => {
    switch (key) {
      case "0":
        return "Agent"
      case "1":
        return "Customer"
      case "2":
        return "All"
      default:
        break;
    }
  }
  const onChangePhrase = React.useCallback(
    (event: any, key: string, newValue?: string) => {
      ////console.log('onchangePhrase', key, newValue);
      setJsonByPath(gState.currentTreeJson, key, newValue);
      //////console.log(gState.currentTreeJson);
    },
    [],
  );

  const onChangeInterval = React.useCallback(
    (event: any, key: string, newValue?: string) => {
      console.log('onChangeInterval', key, newValue);
      setJsonByPath(gState.currentTreeJson, key, newValue);
      //////console.log(gState.currentTreeJson);
    },
    [],
  );

  const onChangeNotWithin = React.useCallback(
    (event: any, checked: boolean, key: string) => {
      console.log('onChangeNotWithin', key, checked);
      setJsonByPath(gState.currentTreeJson, key, checked);
      onRefresh();
    },
    [],
  );
  const onChangeChannel = React.useCallback(
    (key: string, ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) => {
      ////console.log('onChangeChannel', key, option);
      setJsonByPath(gState.currentTreeJson, key, parseInt(option ? option.key : "0"));
      // ////console.log(gState.currentTreeJson);
    },
    [],
  );
  const onChangeFuzzy = React.useCallback(
    (value: string, key: string) => {
      var v: number = parseInt(value);
      setJsonByPath(gState.currentTreeJson, key, v);
      ////console.log(gState.currentTreeJson);
      onRefresh();
    },
    [],
  );

  const onRenderHCell = (nestingDepth: any, item: any, itemIndex: any): any => {
    //console.log("onRenderHCell", item, item.key, item.name, item.value, typeof item.value);
    var apath = item.key.split('.');
    var lastPart = apath.length > 0 ? apath[apath.length - 1] : "";
    const ConvertToPhraseItem = (phrases: any, prefix: string): any[] => {
      var res: any[] = [];
      if (phrases)
        phrases.forEach((x: any, i: number) => res.push({
          key: prefix + '.phrases(' + i + ")",
          name: 'Phrase ' + i,
          value: x
        })
        );
      return res;
    }
    if (typeof item.value === 'object') {
      if (lastPart == "phraseGroups") {
        var d = item.value;//is a array of phraseGroup
        //console.log("dddddd", d);
        var oItems: any[] = [];
        //////console.log("222fffff Array.isArray", d);
        d.forEach((o: any, i: number) => {
          oItems.push(
            <GroupedList key={i + item.key} compact={true} items={ConvertToPhraseItem(o.phrases, item.key + "(" + i + ")_" + (d.length - 1 == i ? 0 : 1))}
              onRenderCell={onRenderHCell} groupProps={groupedListProps}
              groups={[{
                key: item.key + "(" + i + ")_" + (d.length - 1 == i ? 0 : 1), name: "Group " + i,
                startIndex: 0, count: 10, level: 0
              }]} />

          );
          //console.log("pushhy",o, d[0], d[0].groupLinkNext);
          if (i < d.length - 1) {// && currentOperator == "proximity") {
            if (d[i].groupLinkNext && treeOperator == "proximity") {
              oItems.push(
                <Stack key={item.key + i} horizontal horizontalAlign="start" verticalAlign="center" styles={{
                  root: {
                    width: '400px'
                  }
                }}>
                  Interval:<TextField underlined onChange={(event: any, newValue?: string) =>
                    onChangeInterval(event, item.key + "(" + i + ").groupLinkNext.interval", newValue)}
                    placeholder={d[i].groupLinkNext.interval ? d[i].groupLinkNext.interval : 0}
                    style={{ minWidth: '80px' }}
                  />&nbsp;
                <Label>Is not within?</Label><Toggle style={{ width: '30px' }}
                    onChange={(ev: any, checked?: boolean) => onChangeNotWithin(ev, checked != undefined ? checked : false
                      , item.key + "(" + i + ").groupLinkNext.isNotWithin")}
                    checked={d[i].groupLinkNext.isNotWithin ? d[i].groupLinkNext.isNotWithin : false} />
                </Stack>
              );
              //console.log("pushhy22", groupLink ,oItems);
            }
          }
        }
        );

        const myList = (
          <Stack key={item.key} grow styles={{
            root: {
              marginLeft: '40px'
            }
          }}>{oItems}
          </Stack>
        )
        return (myList);
      } else {
        var d = item.value;//is a array of phrases
        //console.log("tree onRenderHCell333", d, d.channel);
        return (
          <Stack horizontal horizontalAlign="start" verticalAlign="center" >
            {item.key.indexOf("_0") < 0 ?
              <FontIcon style={{ fontSize: "26px" }} iconName={'Separator'} className={classNames.deepSkyBlue} />
              :
              <FontIcon style={{ fontSize: "26px" }} className={classNames.deepSkyBlue} />
            }
            <Label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Label>
            <FontIcon style={{ fontSize: "26px" }} iconName={'Separator'} className={classNames.deepSkyBlue} />

            <TextField underlined onChange={(event: any, newValue?: string) =>
              onChangePhrase(event, item.key + ".text", newValue)}
              placeholder={d.text}
              style={{ minWidth: '360px' }}
            />&nbsp;&nbsp;&nbsp;
            <Dropdown style={{ fontSize: "14px" }}
              placeholder={GetChannelName(d.channel.toString())}
              //selectedKey={props.group!.name}
              options={channelOptions}
              // styles={dropdownStyles}
              onChange={(ev: any, o?: any, index?: number) => onChangeChannel(item.key + ".channel", ev, o)}
            />
            {/* <ChoiceGroup styles={{ flexContainer: { display: "flex" } }} 
            onChange={(ev?: React.FormEvent<HTMLElement | HTMLInputElement>, option?: IChoiceGroupOption) =>
              onChangeChannel(item.key +".channel",ev,option)} 
              defaultSelectedKey={d.channel.toString()}
              options={channelOptions} /> */}
            &nbsp;&nbsp;&nbsp;
            Fuzzy:<TextField underlined onChange={(event: any, newValue?: string) =>
              onChangeFuzzy(newValue ? newValue : "0", item.key + ".fuzzy")}
              placeholder={d.fuzzy ? d.fuzzy : 0}
              style={{ maxWidth: '80px' }}
            />
           &nbsp;
            <FontIcon style={{ fontWeight: "bold", fontSize: "12px" }} onClick={() => clickCURD(item.key, 'delete')} iconName={'Cancel'} className={classNames.red} />
            <FontIcon style={{ fontWeight: "bold", fontSize: "12px" }} onClick={() => clickCURD(item.key, 'add')} iconName={'Add'} className={classNames.darkgreen} />
            &nbsp;
          </Stack>
        );
      }
    }
  };
  return (
    <Stack>
      {data.length > 0 && treeJsonArray.map((x: any, j: number) => {
        var thispath = path ? path + "(" + j + ")." : "";
        var dgroups = [{
          isCollapsed: false, key: thispath + 'operator', name: x.operator, startIndex: 0,
          count: 100, level: (thispath.match(/\./g) || []).length
        }];
        var ditems = [{ key: thispath + 'phraseGroups', name: 'phraseGroups', value: x.phraseGroups }];
        return (
          <Stack key={j} grow styles={{
            root: {
              marginLeft: '40px'
            }
          }}>
            <GroupedList compact={true} items={ditems}
              onRenderCell={onRenderHCell}
              groupProps={groupedListProps} groups={dgroups} />
            {x.subSearches && <TranscriptTree data={x.subSearches} path={thispath + "subSearches"} treeOperator={x.operator} onRefresh={onRefresh} />}
          </Stack>
        );
      }
      )}
    </Stack>
  )
};
