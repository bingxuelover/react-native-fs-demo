/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList
} from 'react-native';
import RNFS from 'react-native-fs';
import FileOpener from 'react-native-file-opener';

const SavePath = Platform.OS === 'ios'
  ? RNFS.DocumentDirectoryPath
  : 'file://' + RNFS.ExternalDirectoryPath;

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' + 'Shake or press menu button for dev menu'
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: []
    };
  }

  componentDidMount() {
    this._getFileList()
  }

  _getFileList = () => {
    RNFS.readDir(SavePath).then((result) => {
      this.setState({result})
    }).catch((err) => {
      console.log(err, err.message, err.code);
    });
  }

  _onPressWrite = () => {
    const path = SavePath + '/test.doc';

    RNFS.writeFile(path, '文档内容测试doc', 'utf8').then((success) => {
      console.log('FILE 写成功!');
      this._getFileList()
    }).catch((err) => {
      console.log('writeFile err', err.message);
    });
  }

  _onPressDel = (path, index) => {
    return RNFS.unlink(path).then(() => {
      console.log('删除成功！');
      let datas = [];
      datas = datas.concat(this.state.result);
      datas.splice(index, 1);
      this.setState({result: datas});
    }).catch((err) => {
      console.log('输出出错：', err.message);
    });
  }

  _onPressDownload = () => {
    const sampleImageFileURL = 'https://raw.githubusercontent.com/huangzuizui/react-native-file-opener-demo/master/sample/sample.jpg';
    const sampleImageFilePath = SavePath + '/sample.jpg';

    RNFS.downloadFile({fromUrl: sampleImageFileURL, toFile: sampleImageFilePath}).promise.then(res => {
      console.log('downloadFile', res);
      this._getFileList()
    }).catch(err => console.log('downloadFile err', err))
  }

  _onPressOpen = (path) => {
    const FilePath = path;
    const urlLast = FilePath.lastIndexOf(".");
    const urlType = FilePath.substr(urlLast + 1);
    const FileMimeType = (urlType === ('jpg' || 'jpeg' || 'png'))
      ? 'image'
      : 'application/msword';
    FileOpener.open(FilePath, FileMimeType).then((msg) => {
      console.log('success!!', msg)
    }, (e) => {
      console.log('error!!', e)
    });
  }

  _keyExtractor = (item, i) => {
    return `list${i}`
  }

  _renderItem = (item, index) => {
    return (<View style={styles.listLine}>
      <TouchableOpacity style={styles.listTxt} onPress={() => this._onPressOpen(item.path)}>
        <Text>{item.name}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.listDel} onPress={() => this._onPressDel(item.path, index)}>
        <Text>删除</Text>
      </TouchableOpacity>
    </View>)
  }

  _renderHead = () => {
    return (<View>
      <Text style={styles.listHead}>点击下面的文件本地打开</Text>
    </View>)
  }

  _renderEmpty = () => {
    return (<View>
      <Text style={styles.noList}>还没有本地文件</Text>
    </View>)
  }

  render() {
    const {result} = this.state;
    return (<View style={styles.container}>
      <Text style={styles.welcome}>
        本地文件管理
      </Text>
      <Text style={styles.instructions}>
        文件本地创建，下载，打开，删除
      </Text>
      <TouchableOpacity style={styles.btnBack} onPress={this._onPressWrite}>
        <Text style={styles.btnBackTxt}>创建本地文件</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btnBack} onPress={this._onPressDownload}>
        <Text style={styles.btnBackTxt}>下载远程文件</Text>
      </TouchableOpacity>

      <FlatList style={styles.lists} data={result} extraData={this.state} keyExtractor={this._keyExtractor} ListHeaderComponent={this._renderHead} ListEmptyComponent={this._renderEmpty} renderItem={({item, index}) => this._renderItem(item, index)}/>

      <Text style={styles.instructions}>
        {instructions}
      </Text>
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 20
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  btnBack: {
    backgroundColor: '#549bf0',
    marginTop: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: '#1f84e0',
    width: '80%'
  },
  btnBackTxt: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 20
  },
  lists: {
    flex: 1,
    width: '100%'
  },
  listHead: {
    lineHeight: 50,
    fontWeight: 'bold',
    fontSize: 16
  },
  noList: {
    fontSize: 12
  },
  listLine: {
    flexDirection: 'row',
    paddingVertical: 5,
    flex: 1
  },
  listTxt: {
    flex: 1
  },
  listDel: {
    width: 80,
    alignItems: 'center'
  }
});
