<?php
// Create connection
$con=mysqli_connect("localhost","my_username","my_password","my_database");

// Check connection
if (mysqli_connect_errno())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$id = strval($_GET['id']);
$name = strval($_GET['name']);
$estimatedDiameterMin = floatval($_GET['estimatedDiameterMin']);
$estimatedDiameterMax = floatval($_GET['estimatedDiameterMax']);
$isPotentiallyHazardous = intval($_GET['isPotentiallyHazardous']);
$approachDate = intval($_GET['approachDate']);
$approachSpeed = doubleval($_GET['approachSpeed']);
$missDistance = doubleval($_GET['missDistance']);

// prepare and bind

$stmt1 = $con->prepare("INSERT INTO `NearEarthObjects`(`id`, `name`, `estimatedDiameterMin`, `estimatedDiameterMax`, `isPotentiallyHazardous`)
VALUES (?,?,?,?,?);");

$stmt1->bind_param("ssddi", $id, $name, $estimatedDiameterMin, $estimatedDiameterMax, $isPotentiallyHazardous);
$stmt1->execute();

$stmt1->close();

$stmt2 = $con->prepare("INSERT INTO `CloseApproaches`(`approachDate`, `approachSpeed`, `missDistance`, `asteroidId`)
VALUES (?,?,?,?);");
$stmt2->bind_param("idds", $approachDate, $approachSpeed, $missDistance, $id);
$stmt2->execute();
$stmt2->close();

$con->close();
// Close connections
mysqli_close($con);
?>