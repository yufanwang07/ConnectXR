using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SpawnBall : MonoBehaviour
{
    public GameObject prefab;
    public int count;
    public Vector3 initialPosition;
    public Vector3 finalPosition;
    public LineRenderer lineRenderer;

    // Start is called before the first frame update
    void Start()
    {
        count = 0;
    }

    // Update is called once per frame
    void Update()
    {
        if (OVRInput.GetDown(OVRInput.Button.SecondaryIndexTrigger)) {
            GameObject spawnedBall = Instantiate(prefab, transform.position, Quaternion.identity);
            Rigidbody spawnedBallBody = spawnedBall.GetComponent<Rigidbody>();
            if (count % 2 == 0) {
                initialPosition = spawnedBall.transform.position;
            } else {
                finalPosition = spawnedBall.transform.position;

                //For creating line renderer object
                lineRenderer = new GameObject("Line").AddComponent<LineRenderer>();
                lineRenderer.startColor = Color.black;
                lineRenderer.endColor = Color.black;
                lineRenderer.startWidth = 0.01f;
                lineRenderer.endWidth = 0.01f;
                lineRenderer.positionCount = 2;
                lineRenderer.useWorldSpace = true;    
                                
                //For drawing line in the world space, provide the x,y,z values
                lineRenderer.SetPosition(0, initialPosition); //x,y and z position of the starting point of the line
                lineRenderer.SetPosition(1, finalPosition); //x,y and z position of the end point of the line
            }
            count++;
        }
    }
}

