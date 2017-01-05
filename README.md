# checkin
A Check-In Application for the Sunshine School

# valid users for testing
- Driver: 4
- Nurse: 5
- Therapis: 6

# Classroom data flow:
## list
- This is the only place where the student table needs to be plugged in.
- It will need to be modified based on the parent page to show either all checked in students, or those who are not checked in

## classroom-id
- This will be where therapist/nurse/driver id's will be looked up
- If ID matches page they are on it will be passed back to the parent page

## action-button
- this is where a new db entry will be made as to who is checking the student out, or checking them in
- Aesthetic work needs to be done to show who is selected for checkin/checkout
- if a therapist/nurse has a student checked out the button should change to a check in button

## present-students
- This list will eventually show on the right side where a student is (once DB is hooked in)

## signin, signout, therapy, nurse
- renders classroom-id, if ID is approved, renders list, action-button to select students

## nap
- renders list and nap-buttons
