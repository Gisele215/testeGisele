
   // Configure o Firebase com suas credenciais
    const firebaseConfig = {
        apiKey:"AIzaSyC1_u_I_eLTctU6zaf_YAUmhjD6SxsZM7w",
        authDomain: "testegisele-d5bbb.firebaseapp.com",
        databaseURL:"https://testegisele-d5bbb-default-rtdb.firebaseio.com/",
        projectId: "testegisele",
        storageBucket: "gs://testegisele-d5bbb.appspot.com",
        messagingSenderId: "594202472296",
        appId: "1:594202472296:web:715d278177f9ccb71330dd"
       };
         
        firebase.initializeApp(firebaseConfig);

        // Obtém uma referência para o banco de dados Firebase
        const database = firebase.database(); // Inicialize o banco de dados
        const storage = firebase.storage(); // Inicialize o storage

           function enviarDadosParaFirebase() {
            const nomeAluno = document.getElementById('nome').value;
            const turma = document.getElementById('turma').value;
            const curso = document.getElementById('curso').value;
            const imagem = document.getElementById('imagem').files[0]; // Obtém o arquivo de imagem
        
            if (imagem) {
                const storageRef = storage.ref('imagens/' + imagem.name);
                storageRef.put(imagem).then(snapshot => {
                    snapshot.ref.getDownloadURL().then(downloadURL => {
                        const dados = {
                            nomeAluno: nomeAluno,
                            turma: turma,
                            curso: curso,
                            imagemURL: downloadURL // Salva a URL da imagem
                        };
                        database.ref('alunos').push(dados)
                        .then(() => {
                            alert('Dados enviados com sucesso!');
                            document.getElementById('nome').value = '';
                            document.getElementById('turma').value = '';
                            document.getElementById('curso').value = '';
                            document.getElementById('imagem').value = '';
                        })
                        .catch(error => {
                            console.error('Erro ao enviar os dados para o Realtime Database: ', error);
                            alert('Erro ao enviar os dados. Por favor, tente novamente.');
                        });
                    });
                }).catch(error => {
                    console.error('Erro ao fazer upload da imagem: ', error);
                    alert('Erro ao enviar a imagem. Por favor, tente novamente.');
                });
            } else {
                alert('Por favor, selecione uma imagem.');
            }
        }
        
           function consultarAlunoPorNome() {
            const nome = document.getElementById('nomeConsulta').value.trim();
            const alunosRef = database.ref('alunos');
            alunosRef.orderByChild('nomeAluno').equalTo(nome).once('value', snapshot => {
            const data = snapshot.val();
            const lista = document.getElementById('listaAlunos');
            lista.innerHTML = ''; // Limpar lista anterior

            if (data) {
            Object.keys(data).forEach(key => {
            const aluno = data[key];
            const item = document.createElement('li');
            item.innerHTML = `Nome: ${aluno.nomeAluno}, Turma: ${aluno.turma}, Curso: 
           ${aluno.curso}, Imagem: <img src="${aluno.imagemURL}" alt="Imagem do Aluno" 
           style="width:100px; height:auto;">`;
            lista.appendChild(item);
            });
            } else {
            lista.innerHTML = '<li>Nenhum aluno encontrado com esse nome.</li>';
            }
            }).catch(error => {
            console.error('Erro ao buscar alunos: ', error);
            });
           }