export const translations = {
  es: {
    // Navigation
    calendar: "Calendario",
    projects: "Proyectos",
    tasks: "Tareas",
    settings: "Configuración",

    // Common actions
    create: "Crear",
    edit: "Editar",
    delete: "Eliminar",
    duplicate: "Duplicar",
    cancel: "Cancelar",
    save: "Guardar",
    close: "Cerrar",
    search: "Buscar",
    filter: "Filtrar",

    // Auth
    auth: {
      signIn: "Iniciar Sesión",
      signInDesc: "Ingresa a tu cuenta para continuar",
      createAccount: "Crear Cuenta",
      createAccountDesc: "Crea una nueva cuenta para comenzar",
      email: "Correo Electrónico",
      emailPlaceholder: "tu@email.com",
      password: "Contraseña",
      passwordPlaceholder: "Tu contraseña",
      fullName: "Nombre Completo",
      fullNamePlaceholder: "Tu nombre completo",
      fullNameRequired: "El nombre completo es requerido",
      alreadyHaveAccount: "¿Ya tienes cuenta? Inicia sesión",
      dontHaveAccount: "¿No tienes cuenta? Crear una",
      loading: "Cargando...",
      genericError: "Ocurrió un error. Inténtalo de nuevo.",
      signOut: "Cerrar Sesión",
    },

    // Tutorial
    tutorial: {
      welcome: {
        title: "¡Bienvenido a tu Agenda!",
        description:
          "Te guiaremos a través de las funciones principales para que puedas aprovechar al máximo tu nueva aplicación de gestión de tareas y proyectos.",
      },
      sidebar: {
        title: "Barra Lateral",
        description:
          "Aquí puedes navegar entre Calendario, Proyectos y Tareas. También puedes crear y gestionar tus calendarios personalizados.",
      },
      calendar: {
        title: "Vista de Calendario",
        description:
          "Visualiza todas tus tareas, proyectos y milestones en un calendario mensual, semanal o diario. Los eventos se muestran con colores según su prioridad.",
      },
      newButton: {
        title: "Botón Nuevo",
        description:
          "Usa este botón para crear rápidamente nuevas tareas o proyectos según la vista actual. Es tu acceso directo para agregar contenido.",
      },
      search: {
        title: "Búsqueda",
        description:
          "Busca rápidamente entre todas tus tareas, proyectos y milestones. La búsqueda es en tiempo real y funciona con títulos, descripciones y etiquetas.",
      },
      tasks: {
        title: "Gestión de Tareas",
        description:
          "Organiza tus tareas por calendario, marca como completadas, filtra por estado y gestiona toda tu productividad desde aquí.",
      },
      complete: {
        title: "¡Tutorial Completado!",
        description:
          "Ya conoces las funciones principales. ¡Comienza a crear tus primeras tareas y proyectos para organizar tu trabajo!",
      },
      next: "Siguiente",
      previous: "Anterior",
      finish: "Finalizar",
      skip: "Saltar tutorial",
    },

    // Calendar
    today: "Hoy",
    month: "Mes",
    week: "Semana",
    day: "Día",
    upcomingEvents: "Próximos eventos",
    noEventsScheduled: "No hay eventos programados",
    eventsWillAppear: "Los eventos aparecerán aquí cuando crees proyectos con fechas de entrega o milestones.",

    // Tasks
    newTask: "Nueva tarea",
    createTask: "Crear Tarea",
    taskTitle: "Título de la tarea",
    taskDescription: "Descripción detallada de la tarea",
    priority: "Prioridad",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    project: "Proyecto",
    assignedTo: "Asignado a",
    dueDate: "Fecha de entrega",
    selectPriority: "Seleccionar prioridad",
    selectProject: "Seleccionar proyecto",
    assignTo: "Asignar a...",
    selectDate: "Seleccionar fecha",
    titleRequired: "El título es requerido",
    priorityRequired: "La prioridad es requerida",
    noTasks: "No hay tareas",
    startCreatingTasks: "Comienza creando tu primera tarea para organizar tu trabajo.",
    useNewTaskButton: 'Usa el botón "+ Nueva tarea" en el header para crear una tarea.',
    organizeTasks: "Organiza y gestiona tus tareas",
    tasksShown: "tareas, {shown} mostradas",
    allTasks: "Todas las tareas",
    pending: "Pendientes",
    completed: "Completadas",
    taskCompleted: "Tarea completada - Se eliminará en breve...",

    // Projects
    newProject: "Nuevo proyecto",
    createProject: "Crear Proyecto",
    editProject: "Editar Proyecto",
    projectTitle: "Título del Proyecto",
    projectName: "Nombre del proyecto",
    description: "Descripción",
    projectDescription: "Descripción detallada del proyecto",
    deliveryDate: "Fecha de entrega",
    milestones: "Milestones",
    addMilestone: "Agregar",
    milestone: "Milestone",
    milestoneDate: "Fecha del milestone",
    teamMembers: "Miembros del equipo",
    selected: "seleccionados",
    progress: "Progreso",
    team: "Equipo",
    status: "Estado",
    inProgress: "En progreso",
    nearCompletion: "Por completar",
    noProjects: "No hay proyectos",
    startCreatingProjects: "Comienza creando tu primer proyecto para organizar tus tareas y milestones.",
    useNewProjectButton: 'Usa el botón "+ Nuevo proyecto" en el header para crear un proyecto.',
    manageProjects: "Gestiona tus proyectos y milestones",
    saveChanges: "Guardar Cambios",

    // Calendars
    calendars: "Calendarios",
    newCalendar: "Nuevo Calendario",
    createCalendar: "Crear Calendario",
    calendarName: "Nombre del Calendario",
    calendarColor: "Color del Calendario",
    selectColor: "Seleccionar color",
    calendarNameRequired: "El nombre del calendario es requerido",
    nameMinLength: "El nombre debe tener al menos 2 caracteres",
    describeCalendar: "Describe el propósito de este calendario...",
    organizeEvents: "Crea un nuevo calendario para organizar tus eventos y tareas por categorías específicas.",

    // Search
    searchResults: "Resultados de búsqueda",
    resultsFound: "Se encontraron {count} resultado{plural}",
    noResultsFound: "No se encontraron resultados",
    noMatchingElements: 'No hay elementos que coincidan con "{term}"',
    enterSearchTerm: "Ingresa un término de búsqueda para encontrar tareas, proyectos y milestones",
    searchPlaceholder: "Buscar tareas, proyectos...",

    // Collaborators
    inviteCollaborators: "Invitar Colaboradores",
    inviteCollaboratorsDesc:
      "Invita a colaboradores a tus calendarios y proyectos especificando sus permisos y accesos.",
    emails: "Correos electrónicos",
    add: "Agregar",
    role: "Rol",
    viewer: "Visualizador",
    editor: "Editor",
    admin: "Administrador",
    selectRole: "Seleccionar rol",
    customMessage: "Mensaje personalizado (opcional)",
    invitationMessage: "Escribe un mensaje de invitación personalizado...",
    sendInvitations: "Enviar Invitaciones",
    emailRequired: "Debe agregar al menos un email",
    invalidEmails: "Emails inválidos: {emails}",
    roleRequired: "Debe seleccionar un rol",
    accessRequired: "Debe seleccionar al menos un calendario o proyecto",

    // Event details
    eventDetails: "Detalles del Evento",

    // Priorities and status
    priorities: {
      high: "Alta",
      medium: "Media",
      low: "Baja",
    },

    statuses: {
      "in-progress": "En progreso",
      "near-completion": "Por completar",
      completed: "Completado",
    },

    // Days and months
    days: {
      sunday: "Domingo",
      monday: "Lunes",
      tuesday: "Martes",
      wednesday: "Miércoles",
      thursday: "Jueves",
      friday: "Viernes",
      saturday: "Sábado",
    },

    daysShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],

    months: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],

    // Colors
    colors: {
      blue: "Azul",
      green: "Verde",
      purple: "Púrpura",
      orange: "Naranja",
      red: "Rojo",
      pink: "Rosa",
      indigo: "Índigo",
      yellow: "Amarillo",
    },

    // Success messages
    success: {
      calendarCreated: 'Calendario "{name}" creado exitosamente',
      taskCreated: 'Tarea "{name}" creada exitosamente',
      projectCreated: 'Proyecto "{name}" creado exitosamente',
      projectUpdated: 'Proyecto "{name}" actualizado exitosamente',
      projectDuplicated: 'Proyecto "{name}" duplicado exitosamente',
      projectDeleted: 'Proyecto "{name}" eliminado exitosamente',
    },

    // Confirmations
    confirmDelete: '¿Estás seguro de que quieres eliminar el proyecto "{name}"?\n\nEsta acción no se puede deshacer.',

    // Language
    language: "Idioma",
    spanish: "Español",
    english: "English",
  },

  en: {
    // Navigation
    calendar: "Calendar",
    projects: "Projects",
    tasks: "Tasks",
    settings: "Settings",

    // Common actions
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    duplicate: "Duplicate",
    cancel: "Cancel",
    save: "Save",
    close: "Close",
    search: "Search",
    filter: "Filter",

    // Auth
    auth: {
      signIn: "Sign In",
      signInDesc: "Enter your account to continue",
      createAccount: "Create Account",
      createAccountDesc: "Create a new account to get started",
      email: "Email",
      emailPlaceholder: "your@email.com",
      password: "Password",
      passwordPlaceholder: "Your password",
      fullName: "Full Name",
      fullNamePlaceholder: "Your full name",
      fullNameRequired: "Full name is required",
      alreadyHaveAccount: "Already have an account? Sign in",
      dontHaveAccount: "Don't have an account? Create one",
      loading: "Loading...",
      genericError: "An error occurred. Please try again.",
      signOut: "Sign Out",
    },

    // Tutorial
    tutorial: {
      welcome: {
        title: "Welcome to your Agenda!",
        description:
          "We'll guide you through the main features so you can make the most of your new task and project management application.",
      },
      sidebar: {
        title: "Sidebar",
        description:
          "Here you can navigate between Calendar, Projects, and Tasks. You can also create and manage your custom calendars.",
      },
      calendar: {
        title: "Calendar View",
        description:
          "View all your tasks, projects, and milestones in a monthly, weekly, or daily calendar. Events are displayed with colors based on their priority.",
      },
      newButton: {
        title: "New Button",
        description:
          "Use this button to quickly create new tasks or projects based on the current view. It's your shortcut to add content.",
      },
      search: {
        title: "Search",
        description:
          "Quickly search through all your tasks, projects, and milestones. Search is real-time and works with titles, descriptions, and tags.",
      },
      tasks: {
        title: "Task Management",
        description:
          "Organize your tasks by calendar, mark as completed, filter by status, and manage all your productivity from here.",
      },
      complete: {
        title: "Tutorial Complete!",
        description:
          "You now know the main features. Start creating your first tasks and projects to organize your work!",
      },
      next: "Next",
      previous: "Previous",
      finish: "Finish",
      skip: "Skip tutorial",
    },

    // Calendar
    today: "Today",
    month: "Month",
    week: "Week",
    day: "Day",
    upcomingEvents: "Upcoming events",
    noEventsScheduled: "No events scheduled",
    eventsWillAppear: "Events will appear here when you create projects with due dates or milestones.",

    // Tasks
    newTask: "New task",
    createTask: "Create Task",
    taskTitle: "Task title",
    taskDescription: "Detailed task description",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",
    project: "Project",
    assignedTo: "Assigned to",
    dueDate: "Due date",
    selectPriority: "Select priority",
    selectProject: "Select project",
    assignTo: "Assign to...",
    selectDate: "Select date",
    titleRequired: "Title is required",
    priorityRequired: "Priority is required",
    noTasks: "No tasks",
    startCreatingTasks: "Start by creating your first task to organize your work.",
    useNewTaskButton: 'Use the "+ New task" button in the header to create a task.',
    organizeTasks: "Organize and manage your tasks",
    tasksShown: "tasks, {shown} shown",
    allTasks: "All tasks",
    pending: "Pending",
    completed: "Completed",
    taskCompleted: "Task completed - Will be removed shortly...",

    // Projects
    newProject: "New project",
    createProject: "Create Project",
    editProject: "Edit Project",
    projectTitle: "Project Title",
    projectName: "Project name",
    description: "Description",
    projectDescription: "Detailed project description",
    deliveryDate: "Delivery date",
    milestones: "Milestones",
    addMilestone: "Add",
    milestone: "Milestone",
    milestoneDate: "Milestone date",
    teamMembers: "Team members",
    selected: "selected",
    progress: "Progress",
    team: "Team",
    status: "Status",
    inProgress: "In progress",
    nearCompletion: "Near completion",
    noProjects: "No projects",
    startCreatingProjects: "Start by creating your first project to organize your tasks and milestones.",
    useNewProjectButton: 'Use the "+ New project" button in the header to create a project.',
    manageProjects: "Manage your projects and milestones",
    saveChanges: "Save Changes",

    // Calendars
    calendars: "Calendars",
    newCalendar: "New Calendar",
    createCalendar: "Create Calendar",
    calendarName: "Calendar Name",
    calendarColor: "Calendar Color",
    selectColor: "Select color",
    calendarNameRequired: "Calendar name is required",
    nameMinLength: "Name must be at least 2 characters",
    describeCalendar: "Describe the purpose of this calendar...",
    organizeEvents: "Create a new calendar to organize your events and tasks by specific categories.",

    // Search
    searchResults: "Search results",
    resultsFound: "{count} result{plural} found",
    noResultsFound: "No results found",
    noMatchingElements: 'No elements match "{term}"',
    enterSearchTerm: "Enter a search term to find tasks, projects and milestones",
    searchPlaceholder: "Search tasks, projects...",

    // Collaborators
    inviteCollaborators: "Invite Collaborators",
    inviteCollaboratorsDesc:
      "Invite collaborators to your calendars and projects by specifying their permissions and access.",
    emails: "Email addresses",
    add: "Add",
    role: "Role",
    viewer: "Viewer",
    editor: "Editor",
    admin: "Administrator",
    selectRole: "Select role",
    customMessage: "Custom message (optional)",
    invitationMessage: "Write a personalized invitation message...",
    sendInvitations: "Send Invitations",
    emailRequired: "Must add at least one email",
    invalidEmails: "Invalid emails: {emails}",
    roleRequired: "Must select a role",
    accessRequired: "Must select at least one calendar or project",

    // Event details
    eventDetails: "Event Details",

    // Priorities and status
    priorities: {
      high: "High",
      medium: "Medium",
      low: "Low",
    },

    statuses: {
      "in-progress": "In progress",
      "near-completion": "Near completion",
      completed: "Completed",
    },

    // Days and months
    days: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    },

    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],

    months: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],

    // Colors
    colors: {
      blue: "Blue",
      green: "Green",
      purple: "Purple",
      orange: "Orange",
      red: "Red",
      pink: "Pink",
      indigo: "Indigo",
      yellow: "Yellow",
    },

    // Success messages
    success: {
      calendarCreated: 'Calendar "{name}" created successfully',
      taskCreated: 'Task "{name}" created successfully',
      projectCreated: 'Project "{name}" created successfully',
      projectUpdated: 'Project "{name}" updated successfully',
      projectDuplicated: 'Project "{name}" duplicated successfully',
      projectDeleted: 'Project "{name}" deleted successfully',
    },

    // Confirmations
    confirmDelete: 'Are you sure you want to delete the project "{name}"?\n\nThis action cannot be undone.',

    // Language
    language: "Language",
    spanish: "Español",
    english: "English",
  },
}

export type Language = keyof typeof translations
export type TranslationKey = keyof typeof translations.es
