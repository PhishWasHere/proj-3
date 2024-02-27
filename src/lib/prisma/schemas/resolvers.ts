import getError from "@/utils/getErr";
import prisma from "@/lib/prisma";

// need to fix types later
// type TaskType = {
//   id: string;
//   name: string;
//   description: string;
//   isActive: boolean;
//   priority: number;
//   dueDate: Date;
//   project: ProjectType;
// };

// type ProjectType = {
//   id: string;
//   name: string;
//   description: string;
//   isActive: boolean;
//   createdAt: Date;
//   createdBy: UserType;
//   dueDate: Date;
//   tasks: TaskType[];
// };

// type UserType = {
//   id: string;
//   name: string;
//   email: string;
//   createdAt: Date;
//   projects: ProjectType[];
// };

// type ContextType = {
//   prisma: Prisma;
//   user: UserType;
//   project: ProjectType;
//   task: TaskType;
// };

const resolvers = {
  Query: {
    Hello: () => "Word!",

    users: async (parent: any, args: any, context: any) => {
      // for testing purposes
      return prisma.user.findMany();
    },
    
    user: async (parent: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");
      if (!{id}) throw new Error("No user found");

      try {
        return prisma.user.findUnique({
          where: { id: String(id) },
        });

      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    projects: async (parent: any, args: any, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        return prisma.project.findMany({
          where: { createdBy: { id: context.prisma.user.id } },
        });

      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    project: async (parent: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        return prisma.project.findUnique({
          where: { id: String(id) },
        });

      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    }
    
  },

  Mutation: {
    signup: async (parent: any, { email, password, name }: { email: string, password: string, name: string }, context: any) => {
      try {
        const user = await prisma.user.create({
          data: {
            email,
            password, // need to hash
            name,
          },
        });

        return user;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    login: async (parent: any, { email, password }: { email: string, password: string }, context: any) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) throw new Error("No user found");

        return user;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    createProject: async (parent: any, { name, description, dueDate }: { name: string, description: string, dueDate: Date }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        const project = await prisma.project.create({
          data: {
            name,
            description,
            dueDate,
            createdBy: { connect: { id: context.user.id } },
          },
        });

        return project;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    createTask: async (parent: any, { name, description, priority, dueDate, projectId }: { name: string, description: string, priority: number, dueDate: Date, projectId: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        const task = await prisma.task.create({
          data: {
            name,
            description,
            priority,
            dueDate,
            project: { connect: { id: String(projectId) } },
          },
        });

        return task;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    removeProject: async (parent: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        const project = await prisma.project.delete({
          where: { id: String(id) },
        });

        return project;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    removeTask: async (parent: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        const task = await prisma.task.delete({
          where: { id: String(id) },
        });

        return task;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    removeUser: async (parent: any, { id }: { id: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        const user = await prisma.user.delete({
          where: { id: String(id) },
        });

        return user;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    updateProject: async (parent: any, { id, name, description, dueDate, isActive }: { id: string, name: string, description: string, dueDate: Date, isActive: boolean }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        const project = await prisma.project.update({
          where: { id: String(id) },
          data: {
            name,
            description,
            dueDate,
            isActive,
          },
        });

        return project;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },


    updateTask: async (parent: any, { id, name, description, dueDate, isActive }: { id: string, name: string, description: string, dueDate: Date, isActive: boolean }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        const task = await prisma.task.update({
          where: { id: String(id) },
          data: {
            name,
            description,
            dueDate,
            isActive,
          },
        });

        return task;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    },

    updateUser: async (parent: any, { id, name, email }: { id: string, name: string, email: string }, context: any) => {
      if (!context.user) throw new Error("Not authenticated");

      try {
        const user = await prisma.user.update({
          where: { id: String(id) },
          data: {
            name,
            email,
          },
        });

        return user;
      } catch (err) {
        const msg = getError(err);
        throw new Error(msg);
      }
    }
  }
};

export default resolvers;