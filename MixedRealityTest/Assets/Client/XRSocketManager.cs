// using System.Net;
// using System.Net.Sockets;
// using System.Collections.Generic;
// using System.Collections;
// using System.Text;
// using UnityEngine;
// using System.Threading;


// public class XRSocketManager : MonoBehaviour
// {
//     Thread thread;
//     public int connectionPort = 25001;
//     TcpListener server;
//     TcpClient client;
//     bool running;


//     public OVRSkeleton skeleton;
//     private List<OVRBone> fingerBones;


//     IEnumerator Start()
//     {
//         ThreadStart ts = new ThreadStart(GetData);
//         thread = new Thread(ts);
//         thread.Start();
//         fingerBones = new List<OVRBone>(skeleton.Bones);
//         return null;
//     }

//     void GetData()
//     {
//         // Create the server
//         server = new TcpListener(IPAddress.Any, connectionPort);
//         server.Start();
//         client = server.AcceptTcpClient();
//         running = true;
//         while (running)
//         {
//             Connection();
//         }
//         server.Stop();
//     }

//     void Connection()
//     {
//         // Read data from the network stream
//         NetworkStream nwStream = client.GetStream();
//         byte[] buffer = new byte[client.ReceiveBufferSize];
//         int bytesRead = nwStream.Read(buffer, 0, client.ReceiveBufferSize);

//         // Decode the bytes into a string
//         string dataReceived = Encoding.UTF8.GetString(buffer, 0, bytesRead);
        
//         // Make sure we're not getting an empty string
//         //dataReceived.Trim();
//         if (dataReceived != null && dataReceived != "")
//         {
            
//             fingerBones = new List<OVRBone>(skeleton.Bones);
//             List<Vector3> data = new List<Vector3>();
//             foreach (var bone in fingerBones) {
//                 data.Add(skeleton.transform.InverseTransformPoint(bone.Transform.position));
//             }

//             string sendData = "";
//             foreach (Vector3 datum in data) {
//                 sendData += datum.x + " " + datum.y + " " + datum.z + " ";
//             }

//             byte[] sendBytes = Encoding.UTF8.GetBytes(sendData);
//             nwStream.Write(sendBytes, 0, sendBytes.Length);
//         }
//     }

//     // Use-case specific function, need to re-write this to interpret whatever data is being sent
//     public static void ParseData(string dataString)
//     {
//         Debug.Log(dataString);
//     }

//     void Update()
//     {
//     }

// }