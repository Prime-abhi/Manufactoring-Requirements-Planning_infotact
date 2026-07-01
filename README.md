# Manufactoring-Requirements-Planning_infotact


## Project Setup

### Prerequisites
- Java 17
- Spring Boot 3.3.5
- MySQL 8.0
- Eclipse IDE

### Database Setup
1. Open MySQL Workbench
2. Run the `mrp_database.sql` file
3. Database `mrp_db` and all 6 tables will be created

### Application Setup
1. Copy `src/main/resources/application.properties.example`
2. Rename copy to `application.properties`
3. Add your MySQL password
4. Build the backend jar:
   - `./mvnw -DskipTests package`
5. Start the backend with:
   - `java -jar target/mrp-backend-0.0.1-SNAPSHOT.jar`

---

## Demo Login Credentials

| Role | Email | Password |
|---|---|---|
| Planner | planner@mrp.com | planner123 |
| Manager | manager@mrp.com | manager123 |

---

## Team Branches
| Member | Branch Name |
|---|---|
| Priyanka | priyanka |

---

## Tech Stack
- Java 17
- Spring Boot 3.3.5
- MySQL
- React.js (Frontend)