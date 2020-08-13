import React, {useState, useCallback, useEffect} from 'react';
import { View, Modal, TextInput,AsyncStorage, Text, StyleSheet,SafeAreaView, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import TaskList from './src/components/TaskList';
import * as Animatable from 'react-native-animatable';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App(){
   const [task, setTask] = useState([]);

   const [open, setOpen] = useState(false);
   const [input, setInput] = useState('');

    // buscando todas as tarefas ao iniciar o APP.
   useEffect(()=> {
   async function loadTasks(){
      const taskStorage = await AsyncStorage.getItem('@task');
    
    if(taskStorage){
      setTask(JSON.parse(taskStorage));
      }
    }
    loadTasks();
   },[]);
    
  //salvando caso tenha alguma tarefa alterada
    useEffect(()=>{
   async function saveTasks(){
     await AsyncStorage.setItem('@task', JSON.stringify(task));
    }
    saveTasks();
   }, [task]);
     
     
   

   
 


   function handleAdd(){
     if (input === '') return;

     const data = {
       key: input,
       task: input
     };

     setTask([...task, data]);
     setOpen(false);
     setInput('');
   }

   const handleDelete = useCallback((data) => {
     const find = task.filter(r => r.key !== data.key);
     setTask(find);
   });

  return( 
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='#171d31' barStyle='light-content'/>
    <View style={styles.content}>
      <Text style={styles.title}>Minhas tarefas</Text>
    </View>
    
     <FlatList
     marginHorinzontal={10}
     showsVerticalScrollIndicator={false}
     data={task}
     keyExtractor={(item) => String(item.key) }
     renderItem={({item}) => <TaskList data={item} handleDelete={handleDelete}/> }
     
     />

     <Modal animationType='slide' transparent={false} visible={open}>
       <SafeAreaView style={styles.modal}>
         
         <View style={styles.modalHeader}>
           <TouchableOpacity onPress={() => setOpen(false)} >
             <Ionicons style={{marginLeft: 5, marginRight: 5}} name='md-arrow-back' size={40} color='#000'/>
           </TouchableOpacity>
           <Text style={styles.modalTitle}>Nova Tarefa</Text>
         </View>

         <Animatable.View style={styles.modalBody} animation='fadeInUp' useNativeDriver > 
           <TextInput
           multiline={true}
           placeholderTextColor="#747474"
           autoCorrect={false}
           placeholder='O que precisa fazer hoje?'
           style={styles.input}
           value={input}
           onChangeText={(texto) => setInput(texto)}
           />

          <TouchableOpacity style={styles.handleAdd} onPress={handleAdd} >
               <Text style={styles.handleAddText}>Cadastrar</Text>
          </TouchableOpacity>

         </Animatable.View>
          
       </SafeAreaView>
     </Modal>   
    
     <AnimatedBtn 
     style={styles.fab}
     useNativeDriver
     animation='bounceInUp'
     duration={1500}
     onPress={() => setOpen(true )}
     >
        <Ionicons name='ios-add' size={35} color="#fff"/>
     </AnimatedBtn>
   
   </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
   container:{
   flex: 1,
   backgroundColor: '#171d31'
  },
  title:{
    marginTop: 10,
    paddingBottom: 15,
    fontSize: 25,
    textAlign: 'center',
    color: '#fff'
  },
  fab:{
    position: 'absolute',
    width: 60,
    height: 60,
    backgroundColor: '#0094ff',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    right: 40,
   bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset:{
      width: 1,
      height: 3,
    }
  },
  modal:{
    flex: 1,
    backgroundColor: '#171d31'
  },
  modalHeader: {
    marginLeft: 10,
    marginTop: 23,
   flexDirection: 'row',
    alignItems: 'center'
  },
  modalTitle:{
    marginLeft: 15,
    fontSize: 20,
    color: '#fff'
  },
  modalBody:{
    marginTop: 15
  },
  input:{
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 10,
    height: 85,
    textAlignVertical: 'top',
    color: '#000',
    borderRadius: 5,
  },
  handleAdd:{
    backgroundColor: '#fff',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    borderRadius: 5,
  },
  handleAddText:{
    fontSize: 20
  }
})