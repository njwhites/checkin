# 1/17/17 meeting notes
- Currently use one user ID per individual who may pick up a child. Fingerprint scanner in the past
- In the checkin and checkout, only show the student a parent is authorized to check out
- Don't allow the roster to be seen by parents/non-staff
- Words are better than icons in the roster page
- If a student is taken to therapy during nap time make sure that nap time and therapy time overlap properly (don't double subtract from the billable hours)
- Designate the therapy types at all times: Occupational Therapy (OT), Physical Therapy (PT), and Speech/Language Pathology (SLP)
- Therapists are only one kind of therapist, they won't do a combination of OT/PT/SLP
- For drills a count/total is more important than specific list of kids
- Add therapy checkin/out to therapist page, as well as a way for the Therapist to retroactively log student times
- Therapist page needs some kind of outpatient capability to keep the "warm-body" count accurate in the building
- After school care can sometimes have "late-pickup" students added
- Therapy in After school care should not impact the regular hours billing
- Front desk will probably check students out when they leave school from the nurse
- A generic checkout for the purpose of location tracking was requested


# checkin
A Check-In Application for the Sunshine School

# valid users for testing
- Driver: 50, 51
- Nurse: 70
- Therapist: 40, 41, 42 => three different types of therapy
- Kitchen: 60

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
