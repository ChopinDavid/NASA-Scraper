<?php

// Create connection
$con=mysqli_connect("localhost","mappieap_bandmat","BaNdMaTe4LyFe!%~","mappieap_asteroids");

// Check connection
if (mysqli_connect_errno())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$id = strval($_GET['id']);
$name = strval($_GET['name']);
echo $name;
$estimatedDiameterMin = floatval($_GET['estimatedDiameterMin']);
$estimatedDiameterMax = floatval($_GET['estimatedDiameterMax']);
$isPotentiallyHazardous = intval($_GET['isPotentiallyHazardous']);
$approachDate = intval($_GET['approachDate']);
$approachSpeed = floatval($_GET['approachSpeed']);
$missDistance = floatval($_GET['missDistance']);

// prepare and bind
$stmt = $con->prepare("INSERT INTO `NearEarthObjects`(`id`, `name`, `estimatedDiameterMin`, `estimatedDiameterMax`, `isPotentiallyHazardous`, `approachDate`, `approachSpeed`, `missDistance`)
VALUES (?,?,?,?,?,?,?,?)");
$stmt->bind_param("ssddiidd", $id, $name, $estimatedDiameterMin, $estimatedDiameterMax, $isPotentiallyHazardous, $approachDate, $approachSpeed, $missDistance);

$stmt->execute();

$stmt->close();
$con->close();
// Close connections
mysqli_close($con);
?>